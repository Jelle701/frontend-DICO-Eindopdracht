import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DicoLogo from '../assets/Dico Logo V1.svg';
import './Navbar.css';

function Navbar() {
    const { isAuth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src={DicoLogo} alt="Dico Logo" />
            </Link>
            <ul className="navbar-links">
                {isAuth ? (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><button type="button" onClick={logout}>Uitloggen</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/login">Inloggen</Link></li>
                        <li><Link to="/register" className="register-button">Registreren</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;