import React from 'react'
import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import './layout.scss'

const Layout = () => {
    return (
        <div className='app-shell'>
            <ScrollToTop />
            <Header />
            <div className='app-shell__content'>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Layout
