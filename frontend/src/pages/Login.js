 import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import '../login.css';

// Emoji icons (no extra deps)
const FaSun = () => <span>☀️</span>;
const FaMoon = () => <span>🌙</span>;
const FaEye = () => <span>👁️</span>;
const FaEyeSlash = () => <span>👁️‍🗨️</span>;
const FaSignInAlt = () => <span>↪️</span>;

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [shake, setShake] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;

        if (!email || !password) {
            triggerShake();
            alert('Email and password are required');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                'http://127.0.0.1:5000/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(loginInfo)
                }
            );

            const result = await response.json();
            const { success, message, jwtToken, name } = result;

            if (success) {
                alert(message || 'Login successful');
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);

                setTimeout(() => {
                    navigate('/home');
                }, 800);
            } else {
                triggerShake();
                alert(message || 'Login failed');
            }

        } catch (err) {
            console.error('❌ Login error:', err);
            triggerShake();
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`login-page ${darkMode ? 'dark-theme' : 'light-theme'}`}>
            <div className="login-background"></div>

            <button
                className="theme-toggle"
                onClick={toggleDarkMode}
                aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
                {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            <div className={`login-container ${shake ? 'shake-animation' : ''}`}>
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Login to access your account</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={handleChange}
                            value={loginInfo.email}
                            type="email"
                            name="email"
                            id="email"
                            className="form-input"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-container">
                            <input
                                onChange={handleChange}
                                value={loginInfo.password}
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                id="password"
                                className="form-input"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="spinner"></div>
                        ) : (
                            <>
                                <FaSignInAlt />
                                <span> Login</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="signup-link">
                    Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </div>
            </div>

            <ToastContainer theme={darkMode ? 'dark' : 'light'} />
        </div>
    );
}

export default Login;
