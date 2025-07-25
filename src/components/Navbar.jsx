// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// FIX 1: Gebruik een relatief pad en de 'useAuth' hook.
import { useAuth } from '../contexts/AuthContext.jsx';
// FIX 2: Maak dit pad ook relatief voor consistentie.
import DicoLogo from '../assets/react.svg';
import './NavBar.css';


function Navbar() {
    // FIX 3: Gebruik de custom hook voor schonere code.
    const { isAuth, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/">
                    <img src={DicoLogo} alt="Dico Logo" />
                </Link>
            </div>

            <ul className="navbar-center">
                {isAuth ? (
                    <>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><button type="button" className="btn btn-outline" onClick={logout}>Uitloggen</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/login">Inloggen</Link></li>
                        <li><Link to="/register" className="btn btn-primary">Registreren</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;