// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'; // Importeer Link
import { useAuth, useUser } from '../contexts/AuthContext.jsx';
import DicoLogo from '../assets/react.svg';
import './Navbar.css';

function Navbar() {
    const { isAuth, logout } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation(); // Gebruik de location hook
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const isAdmin = user?.role === 'ADMIN';
    const isProvider = user?.role === 'PROVIDER';
    const dashboardPath = isAdmin ? '/admin-dashboard' : isProvider ? '/provider-dashboard' : '/dashboard';

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

    // Bepaal de classNames voor de admin links handmatig op basis van de volledige URL
    const dashboardLinkClass = `nav-link ${location.pathname === '/admin-dashboard' && (location.hash === '' || location.hash === '#dashboard') ? 'active' : ''}`;
    const managementLinkClass = `nav-link ${location.pathname === '/admin-dashboard' && location.hash === '#management' ? 'active' : ''}`;

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
                            {isAdmin ? (
                                <>
                                    <li><Link to="/admin-dashboard#dashboard" className={dashboardLinkClass}>Dashboard</Link></li>
                                    <li><Link to="/admin-dashboard#management" className={managementLinkClass}>Gebruikersbeheer</Link></li>
                                </> 
                            ) : (
                                // Voor andere rollen gebruiken we NavLink zoals voorheen
                                <li><NavLink to={dashboardPath} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink></li>
                            )}

                            {isProvider && !isAdmin && (
                                <li><NavLink to="/patient-portal" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Patiënten Beheren</NavLink></li>
                            )}

                            {!isProvider && !isAdmin && (
                                <>
                                    <li><NavLink to="/my-data" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Mijn Gegevens</NavLink></li>
                                    <li><NavLink to="/service-hub" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Services</NavLink></li>
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
                            {isAdmin ? (
                                <>
                                    <li><Link to="/admin-dashboard#dashboard" className={dashboardLinkClass} onClick={closeMenu}>Dashboard</Link></li>
                                    <li><Link to="/admin-dashboard#management" className={managementLinkClass} onClick={closeMenu}>Gebruikersbeheer</Link></li>
                                </>
                            ) : (
                                <li><NavLink to={dashboardPath} className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Dashboard</NavLink></li>
                            )}

                            {isProvider && !isAdmin && (
                                <li><NavLink to="/patient-portal" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Patiënten Beheren</NavLink></li>
                            )}

                            {!isProvider && !isAdmin && (
                                <>
                                    <li><NavLink to="/my-data" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Mijn Gegevens</NavLink></li>
                                    <li><NavLink to="/service-hub" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>Services</NavLink></li>
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
