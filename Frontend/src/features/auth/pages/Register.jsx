import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth';
import GoogleAuthButton from '../components/GoogleAuthButton';

const Register = () => {
    const navigate = useNavigate();

    const { loading, handleRegister } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const data = await handleRegister({ username, email, password });
            if (!data?.user) {
                setError('Could not create the account. Please try again.');
                return;
            }
            navigate('/');
        } catch (err) {
            setError(err?.response?.data?.message || 'Registration failed.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className='register-page'>
            <div className='form-container'>
                <h1>Create your account</h1>
                <p className='form-subtitle'>Build your first personalized interview plan in minutes.</p>

                {error && <div className='form-error' role='alert'>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text" id="username" placeholder='Choose a username' required />
                    </div>
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
                            type="password" id="password" placeholder='Create a password (min 8 chars)' minLength={8} required />
                    </div>
                    <button
                        className='btn btn-primary'
                        type='submit'
                        disabled={submitting || loading}
                    >
                        {submitting ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <div className='form-divider'><span>or</span></div>

                <GoogleAuthButton
                    text='signup_with'
                    onSuccess={() => navigate('/')}
                />

                <p>Already have an account? <Link to='/login'>Login</Link></p>
            </div>
        </main>
    )
}

export default Register
