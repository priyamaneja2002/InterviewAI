import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './coming-soon-modal.scss'

/**
 * Lightweight modal that announces an upcoming feature. Closes on backdrop
 * click, the close button, or the Escape key.
 */
const ComingSoonModal = ({
    open,
    onClose,
    title = 'Mock Interviews',
    feature = 'Mock Interviews',
    description = "We're cooking up live, AI-powered mock interviews — voice-driven practice sessions with instant feedback on your answers. It's not quite ready yet, but it's on the way!",
}) => {
    useEffect(() => {
        if (!open) return

        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.()
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [open, onClose])

    if (!open) return null
    if (typeof document === 'undefined') return null

    return createPortal(
        <div
            className='coming-soon-modal'
            role='dialog'
            aria-modal='true'
            aria-labelledby='coming-soon-title'
            onClick={onClose}
        >
            <div className='coming-soon-modal__card' onClick={(e) => e.stopPropagation()}>
                <button
                    type='button'
                    className='coming-soon-modal__close'
                    onClick={onClose}
                    aria-label='Close dialog'
                >
                    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'>
                        <line x1='18' y1='6' x2='6' y2='18' />
                        <line x1='6' y1='6' x2='18' y2='18' />
                    </svg>
                </button>

                <div className='coming-soon-modal__icon'>
                    <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M12 2v4' />
                        <path d='M12 18v4' />
                        <path d='m4.93 4.93 2.83 2.83' />
                        <path d='m16.24 16.24 2.83 2.83' />
                        <path d='M2 12h4' />
                        <path d='M18 12h4' />
                        <path d='m4.93 19.07 2.83-2.83' />
                        <path d='m16.24 7.76 2.83-2.83' />
                    </svg>
                </div>

                <span className='coming-soon-modal__badge'>Under Progress</span>

                <h2 id='coming-soon-title' className='coming-soon-modal__title'>
                    {title} is coming soon
                </h2>

                <p className='coming-soon-modal__body'>{description}</p>

                <div className='coming-soon-modal__hint'>
                    <span className='coming-soon-modal__pulse' />
                    <span>{feature} • In active development</span>
                </div>

                <button type='button' className='coming-soon-modal__cta' onClick={onClose}>
                    Got it
                </button>
            </div>
        </div>,
        document.body
    )
}

export default ComingSoonModal
