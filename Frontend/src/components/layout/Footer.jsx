import React, { useState } from 'react'
import { Link } from 'react-router'
import ComingSoonModal from '../feedback/ComingSoonModal'
import { useAuth } from '../../features/auth/hooks/useAuth'
import './layout.scss'

const Footer = () => {
    const year = new Date().getFullYear()
    const [mockOpen, setMockOpen] = useState(false)
    const { user } = useAuth()

    return (
        <footer className='site-footer'>
            <div className='site-footer__inner'>
                <div className='site-footer__brand'>
                    <span className='site-footer__title'>
                        Interview<span className='highlight'>AI</span>
                    </span>
                    <p className='site-footer__tagline'>
                        AI-powered interview prep tailored to every role.
                    </p>
                </div>

                <div className='site-footer__columns'>
                    <div className='site-footer__col'>
                        <h4>Product</h4>
                        <a href='/#features'>Features</a>
                        <a href='/#how-it-works'>How It Works</a>
                        <Link to='/create-plan'>Create Plan</Link>
                        <button
                            type='button'
                            className='site-footer__link-button'
                            onClick={() => setMockOpen(true)}
                        >
                            Mock Interviews
                            <span className='site-footer__soon-pill'>Soon</span>
                        </button>
                    </div>
                    <div className='site-footer__col'>
                        <h4>Account</h4>
                        {user ? (
                            <Link to='/profile'>Profile</Link>
                        ) : (
                            <>
                                <Link to='/login'>Login</Link>
                                <Link to='/register'>Register</Link>
                            </>
                        )}
                    </div>
                    <div className='site-footer__col'>
                        <h4>Resources</h4>
                        <a href='#'>Privacy Policy</a>
                        <a href='#'>Terms of Service</a>
                        <a href='#'>Help Center</a>
                    </div>
                </div>
            </div>

            <div className='site-footer__bottom'>
                <span>&copy; {year} InterviewAI. All rights reserved.</span>
                <span>Crafted for ambitious candidates.</span>
            </div>

            <ComingSoonModal
                open={mockOpen}
                onClose={() => setMockOpen(false)}
            />
        </footer>
    )
}

export default Footer
