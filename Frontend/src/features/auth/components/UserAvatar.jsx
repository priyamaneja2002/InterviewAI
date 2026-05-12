import React, { useEffect, useState } from 'react'
import { getDisplayName, getInitial } from '../utils/user'

/**
 * Avatar that renders the user's photo (e.g. from Google) and gracefully
 * falls back to the user's initial whenever the image is missing, fails to
 * load, or is blocked (Google `lh3.googleusercontent.com` URLs are commonly
 * rate-limited or return 403 based on the request's referrer).
 *
 * Props:
 *   - user          The auth user object.
 *   - className     Optional className applied to the root <img> or <span>.
 *   - fallbackClass Optional className applied only when the fallback initial is shown.
 *   - size          Optional pixel size hint, used for width/height attributes.
 */
const UserAvatar = ({ user, className = '', fallbackClass = '', size }) => {
    const [errored, setErrored] = useState(false)

    // Reset the error state if the avatar URL changes (e.g. after re-login).
    useEffect(() => {
        setErrored(false)
    }, [user?.avatar])

    const displayName = getDisplayName(user)
    const initial = getInitial(user)
    const showImage = Boolean(user?.avatar) && !errored

    if (showImage) {
        return (
            <img
                src={user.avatar}
                alt={displayName || 'User avatar'}
                className={className}
                referrerPolicy='no-referrer'
                loading='lazy'
                width={size}
                height={size}
                onError={() => setErrored(true)}
            />
        )
    }

    return (
        <span
            className={`${className} ${fallbackClass}`.trim()}
            aria-label={displayName || 'User avatar'}
            role='img'
        >
            {initial}
        </span>
    )
}

export default UserAvatar
