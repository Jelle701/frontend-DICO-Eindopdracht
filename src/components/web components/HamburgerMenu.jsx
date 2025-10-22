// src/components/HamburgerMenu.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './HamburgerMenu.css';

function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const menuRef = useRef(null); // Ref naar de menu-container

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Sluit het menu als er buiten geklikt wordt
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Voeg de event listener toe
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Verwijder de event listener bij het opruimen
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return (
        <div className="hamburger-menu" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className={`hamburger-button ${isOpen ? 'open' : ''}`}
                aria-label="Toggle menu"
            >
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
            </button>

            {isOpen && (
                <div className="dropdown-content">
                    <ul>
                        <li>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                        </li>
                        {/* De volgende links zijn verwijderd omdat de routes niet bestaan. */}
                        {/* 
                        <li>
                            <Link to="/profile" onClick={() => setIsOpen(false)}>Mijn Profiel</Link>
                        </li>
                        <li>
                            <Link to="/settings" onClick={() => setIsOpen(false)}>Instellingen</Link>
                        </li>
                        */}
                        <li className="separator"></li>
                        <li>
                            <button onClick={logout} className="logout-button">
                                Uitloggen
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default HamburgerMenu;
