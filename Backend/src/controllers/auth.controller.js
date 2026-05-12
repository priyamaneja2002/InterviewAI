const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signAuthToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

function setAuthCookie(res, token) {
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
    });
}
/**
 * @name registerUserController
 * @description Register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const isUserAlreadyExists = await userModel.findOne({ $or: [{username}, {email}] });

    if (isUserAlreadyExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        firstName,
        lastName,
        authProvider: 'local',
    });

    const token = signAuthToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({
        message: 'User created successfully',
        user: {
            userId: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    });
}

/**
 * @name loginUserController
 * @description Login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;
    
    const user = await userModel.findOne({ email });

    if (!user || !user.password) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = signAuthToken(user._id);
    setAuthCookie(res, token);

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            userId: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            createdAt: user.createdAt,
        },
    });
}

/**
 * @name googleAuthController
 * @description Authenticate (login or register) a user via a Google ID token.
 *              Expects { credential } in the body containing the JWT credential
 *              returned by Google Identity Services on the client.
 * @access Public
 */
async function googleAuthController(req, res) {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ message: 'Google credential is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(500).json({ message: 'Google sign-in is not configured on the server' });
    }

    let payload;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    } catch (error) {
        console.log('Google token verification failed:', error?.message || error);
        return res.status(401).json({ message: 'Invalid Google credential' });
    }

    const {
        sub: googleId,
        email,
        name,
        given_name: givenName,
        family_name: familyName,
        picture,
        email_verified,
    } = payload || {};

    if (!email || !email_verified) {
        return res.status(401).json({ message: 'Google account email is not verified' });
    }

    // Derive a display first/last name from whatever Google returned.
    const fallbackFirst = (name || '').trim().split(/\s+/)[0] || '';
    const fallbackLast = (name || '').trim().split(/\s+/).slice(1).join(' ') || '';
    const firstName = givenName || fallbackFirst || '';
    const lastName = familyName || fallbackLast || '';

    // Find existing user by googleId or by email so we can link accounts.
    let user = await userModel.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
        // Build a unique, sanitized username from the Google profile.
        const baseUsername = (name || email.split('@')[0])
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '')
            .slice(0, 20) || 'user';

        let username = baseUsername;
        let suffix = 0;
        while (await userModel.findOne({ username })) {
            suffix += 1;
            username = `${baseUsername}${suffix}`;
        }

        user = await userModel.create({
            username,
            email,
            googleId,
            firstName,
            lastName,
            avatar: picture,
            authProvider: 'google',
        });
    } else {
        let updated = false;
        if (!user.googleId) {
            user.googleId = googleId;
            updated = true;
        }
        if (!user.avatar && picture) {
            user.avatar = picture;
            updated = true;
        }
        if (!user.firstName && firstName) {
            user.firstName = firstName;
            updated = true;
        }
        if (!user.lastName && lastName) {
            user.lastName = lastName;
            updated = true;
        }
        if (updated) await user.save();
    }

    const token = signAuthToken(user._id);
    setAuthCookie(res, token);

    res.status(200).json({
        message: 'Logged in with Google',
        user: {
            userId: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            createdAt: user.createdAt,
        },
    });
}


/**
 * @name logoutUserController
 * @description Logs out the user by clearing the authentication token from cookies and adding the token to the blacklist. This prevents reuse of the token after logout.
 * @route GET /api/auth/logout
 * @access Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void}
 */

async function logoutUserController(req, res) {
    const token = req.cookies.token;
    if (token) {
        await tokenBlacklistModel.create({ token });
    }
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: 'User logged out successfully' });
}

/**
 * @name getMeController
 * @description Retrieves the details of the currently logged-in user using the information provided in the authentication token. 
 * @route GET /api/auth/get-me
 * @access Private
 * @param {Object} req - Express request object (expects req.user to be set by authentication middleware)
 * @param {Object} res - Express response object
 * @returns {void}
 */

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.userId);

    res.status(200).json({
        message: 'User details fetched successfully',
        user: {
            userId: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            createdAt: user.createdAt,
        }
    })
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    googleAuthController,
};