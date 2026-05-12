import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

function loadGoogleScript() {
    if (typeof window === 'undefined') return Promise.resolve(null)
    if (window.google?.accounts?.id) return Promise.resolve(window.google)

    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`)
        if (existing) {
            existing.addEventListener('load', () => resolve(window.google))
            existing.addEventListener('error', reject)
            return
        }

        const script = document.createElement('script')
        script.src = GOOGLE_SCRIPT_SRC
        script.async = true
        script.defer = true
        script.onload = () => resolve(window.google)
        script.onerror = reject
        document.head.appendChild(script)
    })
}

const GoogleAuthButton = ({ text = 'continue_with', onSuccess, onError }) => {
    const { handleGoogleLogin } = useAuth()
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const containerRef = useRef(null)
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    const handleCredential = useCallback(
        async (response) => {
            setSubmitting(true)
            setError(null)
            try {
                const data = await handleGoogleLogin({ credential: response.credential })
                onSuccess?.(data)
            } catch (err) {
                const message =
                    err?.response?.data?.message ||
                    'Could not sign in with Google. Please try again.'
                setError(message)
                onError?.(err)
            } finally {
                setSubmitting(false)
            }
        },
        [handleGoogleLogin, onSuccess, onError]
    )

    useEffect(() => {
        if (!clientId) return
        let cancelled = false

        loadGoogleScript()
            .then((google) => {
                if (cancelled || !google || !containerRef.current) return

                google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredential,
                })

                containerRef.current.innerHTML = ''
                google.accounts.id.renderButton(containerRef.current, {
                    type: 'standard',
                    theme: 'filled_black',
                    size: 'large',
                    shape: 'rectangular',
                    text,
                    logo_alignment: 'center',
                    width: containerRef.current.offsetWidth || 320,
                })
            })
            .catch(() => {
                if (!cancelled) setError('Failed to load Google sign-in.')
            })

        return () => {
            cancelled = true
        }
    }, [clientId, handleCredential, text])

    if (!clientId) {
        return (
            <div className='form-error' role='alert'>
                Google sign-in is not configured. Set <code>VITE_GOOGLE_CLIENT_ID</code> in
                the frontend environment (e.g. <code>Frontend/.env</code>) and restart the
                dev server to enable it.
            </div>
        )
    }

    return (
        <div className='google-auth'>
            <div ref={containerRef} className='google-auth__button' aria-busy={submitting} />
            {submitting && <div className='google-auth__status'>Signing in...</div>}
            {error && <div className='form-error' role='alert'>{error}</div>}
        </div>
    )
}

export default GoogleAuthButton
