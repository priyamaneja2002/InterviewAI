import React from 'react'
import { Link, useNavigate } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

function Login() {
    const navigate = useNavigate();

    const { loading, handleLogin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({email, password});
        console.log('Form submitted');
        navigate('/');
    }

    if(loading) {
        return (<main>
            <h1>Loading........</h1>
        </main>)
    }

  return (
    <main className='login-page'>
        <div className='form-container'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div type="text" className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        onChange={(e) => {setEmail(e.target.value)}}
                        type="email" id="email" placeholder='Enter your email' />
                    
                </div>
                <div type="text" className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        onChange={(e) => {setPassword(e.target.value)}}
                        type="password" id="password" placeholder='Enter your password' />

                </div>
                <button className='btn btn-primary' type='submit'>Login</button>
            </form>
            <p>Don't have an account? <Link to='/register'>Register</Link></p>
        </div>
    </main>
  )
}

export default Login