import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth';
import GoogleAuthButton from '../components/GoogleAuthButton';

function Login() {
    const navigate = useNavigate();

    const { loading, handleLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const data = await handleLogin({ email, password });
            if (!data?.user) {
                setError('Invalid email or password.');
                return;
            }
            navigate('/');
        } catch (err) {
            setError(err?.response?.data?.message || 'Login failed.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className='login-page'>
            <div className='form-container'>
                <h1>Welcome back</h1>
                <p className='form-subtitle'>Sign in to access your interview plans.</p>

                {error && <div className='form-error' role='alert'>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" id="email" placeholder='Enter your email' required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" id="password" placeholder='Enter your password' required />
                    </div>
                    <button
                        className='btn btn-primary'
                        type='submit'
                        disabled={submitting || loading}
                    >
                        {submitting ? 'Signing in...' : 'Login'}
                    </button>
                </form>

                <div className='form-divider'><span>or</span></div>

                <GoogleAuthButton
                    text='signin_with'
                    onSuccess={() => navigate('/')}
                />

                <p>Don't have an account? <Link to='/register'>Register</Link></p>
            </div>
        </main>
    )
}

export default Login
