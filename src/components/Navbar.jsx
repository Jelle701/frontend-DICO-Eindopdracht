// src/components/Navbar.jsx

import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from 'src/contexts/AuthContext.jsx';
import { useTheme } from 'src/contexts/ThemeContext.jsx'; // Deze import werkt nu
import './NavBar.css';

function Navbar() {
    // Haal de authenticatie status en functies op via de custom hook
    const { isAuth, logout } = useAuth();
    // Haal de thema status en functie op via de custom hook
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="hero-section">
            <nav className="hero-nav">
                <div className="container navbar">

                    <div className="navbar-left">
                        <Link to="/" className="logo">
                            <img src='/src/content/DicoLogowitV1.svg' alt="DICO Logo" />
                        </Link>
                    </div>


                    <ul className="navbar-center">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/how-it-works">Hoe werkt het</NavLink></li>
                        <li><NavLink to="/why-dico">Waarom DICO</NavLink></li>
                        {isAuth && (
                            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                        )}
                    </ul>


                    <div className="navbar-right">
                        {isAuth ? (
                            <>
                                <Link to="/profile" className="btn btn-light">Profiel</Link>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={logout}
                                >
                                    Uitloggen
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-light">Login</Link>
                                <Link to="/register" className="btn btn-primary">JOIN NU</Link>
                            </>
                        )}
                        <button
                            className="btn btn-outline"
                            onClick={toggleTheme}
                            style={{ marginLeft: '1rem', padding: '0.5rem' }}
                            aria-label="Toggle thema"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;