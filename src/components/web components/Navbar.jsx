// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '../../contexts/AuthContext.jsx';
import DicoLogo from '../../assets/react.svg';
import './NavBar.css';

function Navbar() {
    const { isAuth, logout } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const isAdmin = user?.role === 'ADMIN';
    const isProvider = user?.role === 'PROVIDER';
    const isGuardian = user?.role === 'GUARDIAN'; // Added for clarity
    const dashboardPath = isAdmin ? '/admin-dashboard' : isProvider ? '/provider-dashboard' : isGuardian ? '/guardian-portal' : '/dashboard';

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

    // Custom isActive function for admin links
    const getAdminNavLinkClass = (targetHash) => {
        const isBasePathActive = location.pathname === '/admin-dashboard';
        let isThisLinkActive = false;
        if (targetHash === '#dashboard') {
            isThisLinkActive = isBasePathActive && (location.hash === '' || location.hash === '#dashboard');
        } else if (targetHash === '#management') {
            isThisLinkActive = isBasePathActive && location.hash === '#management';
        }
        return `nav-link ${isThisLinkActive ? 'active' : ''}`;
    };

    // Generic NavLink class for non-admin links
    const getNavLinkClass = ({ isActive }) => {
        return `nav-link ${isActive ? 'active' : ''}`;
    };

    return (
        <nav className="navbar" ref={menuRef}>
            <div className="navbar-container d-flex justify-between items-center"> {/* Removed w-100 */}
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
                                    <li><NavLink to="/admin-dashboard#dashboard" className={getAdminNavLinkClass('/admin-dashboard#dashboard')}>Dashboard</NavLink></li>
                                    <li><NavLink to="/admin-dashboard#management" className={getAdminNavLinkClass('/admin-dashboard#management')}>Gebruikersbeheer</NavLink></li>
                                </> 
                            ) : isGuardian ? (
                                <li><NavLink to="/guardian-portal" className={getNavLinkClass}>Ouderportaal</NavLink></li>
                            ) : isProvider ? (
                                <>
                                    <li><NavLink to="/provider-dashboard" className={getNavLinkClass}>Dashboard</NavLink></li>
                                    <li><NavLink to="/patient-portal" className={getNavLinkClass}>Patiënten Beheren</NavLink></li>
                                </>
                            ) : (
                                // Default Patient links
                                <>
                                    <li><NavLink to="/dashboard" className={getNavLinkClass}>Dashboard</NavLink></li>
                                    <li><NavLink to="/my-data" className={getNavLinkClass}>Mijn Gegevens</NavLink></li>
                                    <li><NavLink to="/service-hub" className={getNavLinkClass}>Services</NavLink></li>
                                </>
                            )}
                            
                            <li><button onClick={handleLogout} className="btn btn--outline">Uitloggen</button></li>
                        </>
                    ) : (
                        <>
                            <li><NavLink to="/login" className="nav-link">Inloggen</NavLink></li>
                            <li><NavLink to="/register" className="btn btn--primary">Registreren</NavLink></li>
                        </>
                    )}
                </ul>

                {isAuth && menuOpen && (
                    <div className="nav-menu-mobile">
                        <ul>
                            {isAdmin ? (
                                <>
                                    <li><NavLink to="/admin-dashboard#dashboard" className={getAdminNavLinkClass('#dashboard')} onClick={closeMenu}>Dashboard</NavLink></li>
                                    <li><NavLink to="/admin-dashboard#management" className={getAdminNavLinkClass('#management')} onClick={closeMenu}>Gebruikersbeheer</NavLink></li>
                                </> 
                            ) : isGuardian ? (
                                <li><NavLink to="/guardian-portal" className={getNavLinkClass} onClick={closeMenu}>Ouderportaal</NavLink></li>
                            ) : isProvider ? (
                                <>
                                    <li><NavLink to="/provider-dashboard" className={getNavLinkClass} onClick={closeMenu}>Dashboard</NavLink></li>
                                    <li><NavLink to="/patient-portal" className={getNavLinkClass} onClick={closeMenu}>Patiënten Beheren</NavLink></li>
                                </>
                            ) : (
                                // Default Patient links
                                <>
                                    <li><NavLink to="/dashboard" className={getNavLinkClass} onClick={closeMenu}>Dashboard</NavLink></li>
                                    <li><NavLink to="/my-data" className={getNavLinkClass} onClick={closeMenu}>Mijn Gegevens</NavLink></li>
                                    <li><NavLink to="/service-hub" className={getNavLinkClass} onClick={closeMenu}>Services</NavLink></li>
                                </>
                            )}

                            <li className="separator"></li>
                            <li><button onClick={handleLogout} className="btn btn--outline">Uitloggen</button></li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
