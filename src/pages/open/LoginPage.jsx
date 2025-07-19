// src/pages/open/LoginPage.jsx

import React, { useState } from 'react';
import { useUser } from './contexts/UserContext.jsx';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// --- VERBETERING ---
// Importeer de Navbar en de bestaande CSS voor een consistente look.
import Navbar from '../../components/Navbar.jsx';
import './register/RegisterPage.css'; // We hergebruiken de CSS van de registratiepagina

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Laadstatus toegevoegd
    const { login } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true); // Start laadstatus

        try {
            await login({ email, password });
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Login failed:', err);
            setError('Ongeldig e-mailadres of wachtwoord. Probeer het opnieuw.');
        } finally {
            setLoading(false); // Stop laadstatus
        }
    };

    return (
        // --- VERBETERING: Volledig nieuwe JSX structuur ---
        // De structuur is nu consistent met uw RegisterPage voor een uniforme stijl.
        <>
            <Navbar />
            <div className="auth-page container">
                <h1 className="text-center">Inloggen</h1>
                <form onSubmit={handleSubmit} className="form flex flex-col gap-4">
                    <div className="form-group">
                        <label htmlFor="email">E-mailadres</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Vul je e-mailadres in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Wachtwoord</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Vul je wachtwoord in"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Inloggen...' : 'Login'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-muted)' }}>
                    Nog geen account? <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Registreer hier</Link>
                </p>
            </div>
        </>
    );
}