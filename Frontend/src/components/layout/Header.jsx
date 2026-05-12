import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { getDisplayName } from '../../features/auth/utils/user'
import UserAvatar from '../../features/auth/components/UserAvatar'
import ComingSoonModal from '../feedback/ComingSoonModal'
import './layout.scss'

const Header = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [mockOpen, setMockOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const userMenuRef = useRef(null)

    const closeUserMenu = () => setUserMenuOpen(false)

    const onLogout = async () => {
        closeUserMenu()
        await handleLogout()
        setMenuOpen(false)
        navigate('/')
    }

    const handleSectionLink = (sectionId) => (e) => {
        e.preventDefault()
        setMenuOpen(false)

        if (location.pathname === '/') {
            const el = document.getElementById(sectionId)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                window.history.replaceState(null, '', `/#${sectionId}`)
            }
        } else {
            navigate(`/#${sectionId}`)
        }
    }

    useEffect(() => {
        if (!userMenuOpen) return

        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                closeUserMenu()
            }
        }
        const handleEscape = (event) => {
            if (event.key === 'Escape') closeUserMenu()
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [userMenuOpen])

    return (
        <header className='site-header'>
            <div className='site-header__inner'>
                <Link to='/' className='site-header__brand' onClick={() => setMenuOpen(false)}>
                    <span className='site-header__logo'>
                        <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                            <path d='M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z' />
                            <path d='m9 12 2 2 4-4' />
                        </svg>
                    </span>
                    <span className='site-header__title'>
                        Interview<span className='highlight'>AI</span>
                    </span>
                </Link>

                <button
                    className={`site-header__toggle ${menuOpen ? 'is-open' : ''}`}
                    aria-label='Toggle navigation'
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    <span /><span /><span />
                </button>

                <nav className={`site-header__nav ${menuOpen ? 'is-open' : ''}`}>

                    <a
                        href='/#features'
                        className='site-header__link'
                        onClick={handleSectionLink('features')}
                    >
                        Features
                    </a>
                    <a
                        href='/#how-it-works'
                        className='site-header__link'
                        onClick={handleSectionLink('how-it-works')}
                    >
                        How It Works
                    </a>

                    {user && (
                        <NavLink
                            to='/create-plan'
                            className={({ isActive }) => `site-header__link ${isActive ? 'is-active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            Create Plan
                        </NavLink>
                    )}
                    
                    <button
                        type='button'
                        className='site-header__link site-header__link--button'
                        onClick={() => { setMenuOpen(false); setMockOpen(true) }}
                    >
                        Mock Interviews
                        <span className='site-header__soon-pill'>Soon</span>
                    </button>


                    <div className='site-header__actions'>
                        {user ? (
                            <div
                                className={`site-header__user-menu ${userMenuOpen ? 'is-open' : ''}`}
                                ref={userMenuRef}
                            >
                                <button
                                    type='button'
                                    className='site-header__user'
                                    onClick={() => setUserMenuOpen((o) => !o)}
                                    aria-haspopup='menu'
                                    aria-expanded={userMenuOpen}
                                    aria-label='Open account menu'
                                >
                                    <UserAvatar
                                        user={user}
                                        fallbackClass='site-header__avatar-fallback'
                                    />
                                    <span className='site-header__user-name'>{getDisplayName(user)}</span>
                                    <span
                                        className={`site-header__user-caret ${userMenuOpen ? 'is-open' : ''}`}
                                        aria-hidden='true'
                                    >
                                        <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                                            <polyline points='6 9 12 15 18 9' />
                                        </svg>
                                    </span>
                                </button>

                                {userMenuOpen && (
                                    <div className='site-header__dropdown' role='menu'>
                                        <div className='site-header__dropdown-header'>
                                            <span className='site-header__dropdown-name'>{getDisplayName(user)}</span>
                                            {user.email && (
                                                <span className='site-header__dropdown-email'>{user.email}</span>
                                            )}
                                        </div>
                                        <div className='site-header__dropdown-divider' />
                                        <Link
                                            to='/profile'
                                            className='site-header__dropdown-item'
                                            role='menuitem'
                                            onClick={() => { closeUserMenu(); setMenuOpen(false) }}
                                        >
                                            <svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                                <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                                                <circle cx='12' cy='7' r='4' />
                                            </svg>
                                            Profile
                                        </Link>
                                        <button
                                            type='button'
                                            className='site-header__dropdown-item site-header__dropdown-item--danger'
                                            role='menuitem'
                                            onClick={onLogout}
                                        >
                                            <svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                                <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
                                                <polyline points='16 17 21 12 16 7' />
                                                <line x1='21' y1='12' x2='9' y2='12' />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to='/login' className='btn btn-primary' onClick={() => setMenuOpen(false)}>Get Started</Link>
                        )}
                    </div>
                </nav>
            </div>

            <ComingSoonModal
                open={mockOpen}
                onClose={() => setMockOpen(false)}
            />
        </header>
    )
}

export default Header
