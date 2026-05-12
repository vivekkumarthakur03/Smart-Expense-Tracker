import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';

import '../login.css';

// Emoji icons
const FaSun = () => <span>☀️</span>;
const FaMoon = () => <span>🌙</span>;
const FaUserPlus = () => <span>➕</span>;

function Signup() {

    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [darkMode, setDarkMode] = useState(false);
    const [shake, setShake] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches;

        setDarkMode(prefersDark);

    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const triggerShake = () => {

        setShake(true);

        setTimeout(() => {
            setShake(false);
        }, 500);
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setSignupInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {

        e.preventDefault();

        const { name, email, password } = signupInfo;

        // VALIDATION
        if (!name || !email || !password) {

            triggerShake();

            toast.error(
                'Name, email, and password are required'
            );

            return;
        }

        try {

            const response = await fetch(
                'http://127.0.0.1:5000/auth/signup',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(signupInfo)
                }
            );

            const result = await response.json();

            const {
                success,
                message
            } = result;

            // SUCCESS
            if (success) {

                toast.success(
                    message || 'Signup successful'
                );

                setTimeout(() => {
                    navigate('/login');
                }, 1200);

            } else {

                triggerShake();

                toast.error(
                    message || 'Signup failed'
                );
            }

        } catch (err) {

            console.error('❌ Signup error:', err);

            triggerShake();

            toast.error(
                'Something went wrong. Please try again.'
            );
        }
    };

    return (

        <div className={`login-page ${darkMode ? 'dark-theme' : 'light-theme'}`}>

            <div className="login-background"></div>

            {/* THEME TOGGLE */}
            <button
                className="theme-toggle"
                onClick={toggleDarkMode}
                aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
                {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* SIGNUP CARD */}
            <div className={`login-container ${shake ? 'shake-animation' : ''}`}>

                <div className="login-header">

                    <h1>Create Account</h1>

                    <p>
                        Sign up to get started
                    </p>

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSignup}
                    className="login-form"
                >

                    {/* NAME */}
                    <div className="form-group">

                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            onChange={handleChange}
                            value={signupInfo.name}
                            type="text"
                            name="name"
                            id="name"
                            className="form-input"
                            placeholder="Enter your name"
                        />

                    </div>

                    {/* EMAIL */}
                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            onChange={handleChange}
                            value={signupInfo.email}
                            type="email"
                            name="email"
                            id="email"
                            className="form-input"
                            placeholder="Enter your email"
                        />

                    </div>

                    {/* PASSWORD */}
                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            onChange={handleChange}
                            value={signupInfo.password}
                            type="password"
                            name="password"
                            id="password"
                            className="form-input"
                            placeholder="Enter your password"
                        />

                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        className="login-button"
                    >

                        <FaUserPlus />

                        <span>
                            Signup
                        </span>

                    </button>

                </form>

                {/* LINKS */}
                <div className="signup-link">

                    Already have an account?

                    {' '}

                    <Link to="/login">
                        Login
                    </Link>

                </div>

                <div
                    style={{
                        marginTop: '15px',
                        textAlign: 'center'
                    }}
                >

                    <Link
                        to="/"
                        style={{
                            color: darkMode ? '#fff' : '#333',
                            textDecoration: 'none'
                        }}
                    >
                        ← Back to Home
                    </Link>

                </div>

            </div>

            {/* TOAST */}
            <ToastContainer
                theme={darkMode ? 'dark' : 'light'}
                position="top-right"
                autoClose={2000}
            />

        </div>
    );
}

export default Signup;