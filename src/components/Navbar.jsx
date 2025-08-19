// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import DicoLogo from '../assets/react.svg';
import './Navbar.css'; // Zorg dat de CSS-bestandsnaam overeenkomt

function Navbar() {
    const { isAuth, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        logout();
        setMenuOpen(false); // Sluit menu na uitloggen
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Sluit het menu als er buiten geklikt wordt
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar" ref={menuRef}>
            <div className="navbar-container">
                <NavLink to={isAuth ? "/dashboard" : "/"} className="navbar-logo" onClick={closeMenu}>
                    <img src={DicoLogo} alt="App Logo" />
                    <span>Diabeheer</span>
                </NavLink>

                {/* Hamburger Button - alleen zichtbaar op mobiel en als ingelogd */}
                {isAuth && (
                    <button
                        onClick={toggleMenu}
                        className={`hamburger-button ${menuOpen ? 'open' : ''}`}
                        aria-label="Toggle menu"
                    >
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                        <div className="hamburger-line"></div>
                    </button>
                )}

                {/* Desktop Menu */}
                <ul className="nav-menu-desktop">
                    {isAuth ? (
                        <>
                            <li><NavLink to="/dashboard" className="nav-link">Dashboard</NavLink></li>
                            <li><NavLink to="/my-data" className="nav-link">Mijn Gegevens</NavLink></li>
                            <li><NavLink to="/service-hub" className="nav-link">Services</NavLink></li>
                            <li><button onClick={handleLogout} className="btn btn-outline">Uitloggen</button></li>
                        </>
                    ) : (
                        <>
                            <li><NavLink to="/login" className="nav-link">Inloggen</NavLink></li>
                            <li><NavLink to="/register" className="btn btn-primary">Registreren</NavLink></li>
                        </>
                    )}
                </ul>

                {/* Mobile Dropdown Menu - alleen als ingelogd en menu open is */}
                {isAuth && menuOpen && (
                    <div className="nav-menu-mobile">
                        <ul>
                            <li><NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</NavLink></li>
                            <li><NavLink to="/my-data" className="nav-link" onClick={closeMenu}>Mijn Gegevens</NavLink></li>
                            <li><NavLink to="/service-hub" className="nav-link" onClick={closeMenu}>Services</NavLink></li>
                            <li className="separator"></li>
                            <li><button onClick={handleLogout} className="btn btn-outline">Uitloggen</button></li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;