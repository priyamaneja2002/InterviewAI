const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');
/**
 * @name registerUserController
 * @description Register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const isUserAlreadyExists = await userModel.findOne({ $or: [{username}, {email}] });

    if (isUserAlreadyExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({ username, email, password: hash });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie("token", token);

    res.status(201).json({ message: 'User created successfully', user: { userId: user._id, username, email } });
}

/**
 * @name loginUserController
 * @description Login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;
    
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const token  = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie("token", token);
    res.status(200).json({ message: 'User logged in successfully', user: { userId: user._id, username: user.username, email: user.email } });
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
    res.clearCookie("token");
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
        }
    })
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
};