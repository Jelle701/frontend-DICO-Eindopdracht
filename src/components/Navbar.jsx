/**
 * @file Navbar.jsx
 * @description This component renders the main navigation bar for the application. It displays different links
 * and actions based on whether the user is authenticated. It features a responsive design with a hamburger
 * menu for mobile viewports.
 *
 * @component
 * @returns {JSX.Element} The main navigation bar component.
 */
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import DicoLogo from '../assets/react.svg';
import './Navbar.css';

/**
 * The main navigation component.
 * It uses the `useAuth` hook to conditionally render links for authenticated or public users.
 * It also manages the state for a responsive mobile menu.
 */
function Navbar() {
    const { isAuth, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null); // Ref to the nav element for outside click detection

    /**
     * Handles the user logout process by calling the logout function from AuthContext
     * and redirecting the user to the login page.
     */
    const handleLogout = () => {
        logout();
        setMenuOpen(false); // Close menu after logging out
        navigate('/login');
    };

    /**
     * Toggles the visibility of the mobile navigation menu.
     */
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    /**
     * Effect to handle clicks outside of the navigation bar to close the mobile menu.
     * This improves user experience on mobile devices.
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    /**
     * Helper function to explicitly close the mobile menu, used by NavLinks.
     */
    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar" ref={menuRef}>
            <div className="navbar-container">
                <NavLink to={isAuth ? "/dashboard" : "/"} className="navbar-logo" onClick={closeMenu}>
                    <img src={DicoLogo} alt="App Logo" />
                    <span>Diabeheer</span>
                </NavLink>

                {/* Hamburger Button - only visible on mobile for logged-in users */}
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

                {/* Mobile Dropdown Menu - only for logged-in users when the menu is open */}
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
