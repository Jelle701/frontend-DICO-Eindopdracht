/**
 * @file HamburgerMenu.jsx
 * @description This component provides a self-contained hamburger menu, which is typically used for mobile navigation.
 * It includes the button, the dropdown menu, and the logic to toggle its visibility and handle user actions.
 * NOTE: This component's functionality seems to overlap with the mobile menu logic already implemented inside `Navbar.jsx`.
 * This might be a candidate for refactoring or could be a deprecated component.
 *
 * @component
 * @returns {JSX.Element} A hamburger menu button and its corresponding dropdown panel.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './HamburgerMenu.css';

/**
 * A self-contained hamburger menu component.
 * It manages its own open/closed state and handles clicks outside the menu to close it.
 */
function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const menuRef = useRef(null); // Ref to the menu container for outside click detection

    /**
     * Toggles the visibility of the dropdown menu.
     */
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    /**
     * Effect to handle clicks outside of the menu to automatically close it.
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
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
                        <li>
                            <Link to="/profile" onClick={() => setIsOpen(false)}>Mijn Profiel</Link>
                        </li>
                        <li>
                            <Link to="/settings" onClick={() => setIsOpen(false)}>Instellingen</Link>
                        </li>
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
