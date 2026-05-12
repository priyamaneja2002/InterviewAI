import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Resets scroll position to the top of the page whenever the pathname changes.
 * Hash-only changes (e.g. /#features) are left untouched so smooth scrolling
 * to in-page anchors continues to work.
 */
const ScrollToTop = () => {
    const { pathname, hash } = useLocation()

    useEffect(() => {
        if (hash) return
        // Bypass CSS `scroll-behavior: smooth` for an instant jump on route change.
        const html = document.documentElement
        const previous = html.style.scrollBehavior
        html.style.scrollBehavior = 'auto'
        window.scrollTo(0, 0)
        html.style.scrollBehavior = previous
    }, [pathname, hash])

    return null
}

export default ScrollToTop
