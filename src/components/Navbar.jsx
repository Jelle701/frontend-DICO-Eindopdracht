import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from 'src/contexts/ThemeContext.jsx';
import { AuthContext } from 'src/contexts/AuthContext.jsx'; // Zorg dat het pad klopt!
import './NavBar.css';


function Navbar() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { isAuth, logout } = useContext(AuthContext); // Haal de auth-status en logout functie op

    return (
        <header className="hero-section">
            <nav className="hero-nav">
                <div className="container navbar">
                    <div className="navbar-left">
                        <Link to="/public" className="logo">
                            <img src='src/content/DicoLogowitV1.svg' alt="DICO Logo" height="35" />
                        </Link>
                    </div>
                    <ul className="navbar-center">
                        <li><a href="#membership">Lidmaatschap</a></li>
                        <li><a href="#how">Hoe werkt het</a></li>
                        <li><a href="#why">Waarom DICO</a></li>
                        <li><a href="#accessories">Accessoires</a></li>
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
                                <Link to="/register" className="btn btn-light">JOIN NU</Link>
                            </>
                        )}
                        <button
                            className="btn btn-outline"
                            onClick={toggleTheme}
                            style={{ marginLeft: '1rem' }}
                        >
                            {theme === 'light' ? '🌙 Donker' : '☀️ Licht'}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;