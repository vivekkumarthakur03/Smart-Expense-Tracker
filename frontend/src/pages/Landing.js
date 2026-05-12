import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../assets/sky.jpg';

import './landing.css';

function Landing() {

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');

        navigate('/');
    };

    return (

         <div
    className="landing"
    style={{
        backgroundImage: `url(${bgImage})`
    }}
>

            {/* NAVBAR */}
            <nav className="navbar">

                <h1 className="logo">
                     EXPENSIO
                </h1>

                <div className="nav-links">

                    {
                        token ? (
                            <>
                                <Link to="/home">Dashboard</Link>

                                <button
                                    className="logout-nav-btn"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/signup">Register</Link>
                            </>
                        )
                    }

                </div>

            </nav>

            {/* HERO */}
            <div className="hero">

                <h1>
                    Manage Your Money Smarter 💰
                </h1>

                <p>
                    Track expenses, monitor income,
                    analyze spending, and get AI-powered insights.
                </p>

                <div className="hero-buttons">

                    {
                        token ? (
                            <Link to="/home">
                                <button className="primary-btn">
                                    Go to Dashboard
                                </button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup">
                                    <button className="primary-btn">
                                        Get Started
                                    </button>
                                </Link>

                                <Link to="/login">
                                    <button className="secondary-btn">
                                        Login
                                    </button>
                                </Link>
                            </>
                        )
                    }

                </div>

            </div>

        </div>
    );
}

export default Landing;