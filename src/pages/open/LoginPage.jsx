import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// FIX: Use relative paths so Vite can reliably find the files.
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import './LoginPage.css'; // We voegen specifieke styling toe

// REMOVED: This CSS import is redundant and could cause style conflicts.
// import '../open/onboarding/RegisterPage.css';


export default function LoginPage() {
    // The backend and context expect 'email', not 'username'.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // Send the correct object to the login function.
            await login({ email, password });
            // Navigation is now handled by the AuthContext after a successful login.
        } catch (err) {
            console.error("Login error:", err);
            // The AuthContext throws a 'new Error()', so we use 'err.message'.
            setError(err.message || "Kon niet inloggen, controleer je gegevens.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <form onSubmit={handleSubmit}>
                    <h1>Inloggen</h1>
                    <div className="input-group">
                        <label htmlFor="email">E-mailadres</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Wachtwoord</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Inloggen</button>
                    <p className="form-footer">
                        Nog geen account? <Link to="/register">Maak er hier een aan</Link>
                    </p>
                </form>
            </div>
        </>
    );
}