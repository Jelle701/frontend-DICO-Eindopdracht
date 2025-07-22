import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from 'src/contexts/AuthContext.jsx';
import DicoLogo from 'src/assets/react.svg'; // Placeholder, vervang dit met je eigen logo
import './NavBar.css';


function Navbar() {
    const { isAuth, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-left"> {/* Correcte class-naam */}
                <Link to="/">
                    <img src={DicoLogo} alt="Dico Logo" />
                </Link>
            </div>

            <ul className="navbar-center"> {/* Correcte class-naam */}
                {isAuth ? (
                    <>
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