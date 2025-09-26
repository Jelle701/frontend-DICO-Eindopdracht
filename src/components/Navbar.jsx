// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '../contexts/AuthContext.jsx'; // Importeer useUser
import DicoLogo from '../assets/react.svg';
import './Navbar.css';

function Navbar() {
    const { isAuth, logout } = useAuth();
    const { user } = useUser(); // Haal de gebruiker op om de rol te bepalen
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Bepaal het juiste dashboard pad op basis van de rol
    const isProvider = user?.role === 'PROVIDER';
    const dashboardPath = isProvider ? '/provider-dashboard' : '/dashboard';

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

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
                <NavLink to={isAuth ? dashboardPath : "/"} className="navbar-logo" onClick={closeMenu}>
                    <img src={DicoLogo} alt="App Logo" />
                    <span>Diabeheer</span>
                </NavLink>

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

                <ul className="nav-menu-desktop">
                    {isAuth ? (
                        <>
                            <li><NavLink to={dashboardPath} className="nav-link">Dashboard</NavLink></li>
                            
                            {/* NIEUW: Link naar patiëntenbeheer voor zorgverleners */}
                            {isProvider && (
                                <li><NavLink to="/patient-portal" className="nav-link">Patiënten Beheren</NavLink></li>
                            )}

                            {!isProvider && (
                                <>
                                    <li><NavLink to="/my-data" className="nav-link">Mijn Gegevens</NavLink></li>
                                    <li><NavLink to="/service-hub" className="nav-link">Services</NavLink></li>
                                </>
                            )}
                            
                            <li><button onClick={handleLogout} className="btn btn-outline">Uitloggen</button></li>
                        </>
                    ) : (
                        <>
                            <li><NavLink to="/login" className="nav-link">Inloggen</NavLink></li>
                            <li><NavLink to="/register" className="btn btn-primary">Registreren</NavLink></li>
                        </>
                    )}
                </ul>

                {isAuth && menuOpen && (
                    <div className="nav-menu-mobile">
                        <ul>
                            <li><NavLink to={dashboardPath} className="nav-link" onClick={closeMenu}>Dashboard</NavLink></li>

                            {/* NIEUW: Link naar patiëntenbeheer voor zorgverleners */}
                            {isProvider && (
                                <li><NavLink to="/patient-portal" className="nav-link" onClick={closeMenu}>Patiënten Beheren</NavLink></li>
                            )}

                            {!isProvider && (
                                <>
                                    <li><NavLink to="/my-data" className="nav-link" onClick={closeMenu}>Mijn Gegevens</NavLink></li>
                                    <li><NavLink to="/service-hub" className="nav-link" onClick={closeMenu}>Services</NavLink></li>
                                </>
                            )}

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
