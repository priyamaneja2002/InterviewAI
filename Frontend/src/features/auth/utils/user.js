/**
 * Return a friendly display name for a user. Prefers the user's first name
 * (used for Google sign-ins where Google provides given_name) and falls back
 * to a humanized version of the username, then the email local part.
 */
export const getDisplayName = (user) => {
    if (!user) return ''
    const first = (user.firstName || '').trim()
    if (first) return first

    const username = (user.username || '').trim()
    if (username) {
        // Capitalize first letter for nicer presentation.
        return username.charAt(0).toUpperCase() + username.slice(1)
    }

    const email = user.email || ''
    return email.split('@')[0] || 'User'
}

/**
 * Return a single uppercase initial that can be used inside an avatar fallback.
 */
export const getInitial = (user) => {
    const display = getDisplayName(user) || 'U'
    return display.charAt(0).toUpperCase()
}

/**
 * Build a full name from firstName/lastName, falling back to display name.
 */
export const getFullName = (user) => {
    if (!user) return ''
    const parts = [user.firstName, user.lastName].filter(Boolean).map((p) => p.trim()).filter(Boolean)
    if (parts.length) return parts.join(' ')
    return getDisplayName(user)
}
