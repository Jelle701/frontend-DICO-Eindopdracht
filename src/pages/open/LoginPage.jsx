import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
// Gebruik de centrale AuthContext voor authenticatie.
import { useAuth } from '../../contexts/AuthContext.jsx';
// Importeer de algemene stylesheet.
import '../../App.css';

export default function LoginPage() {
    // Hooks voor navigatie en het ophalen van de vorige locatie.
    const navigate = useNavigate();
    const location = useLocation();

    // Haal de login functie uit onze AuthContext.
    const { login } = useAuth();

    // State voor de formuliergegevens, laadstatus en foutmeldingen.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Functie die wordt aangeroepen bij het submitten van het formulier.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset de foutmelding bij elke nieuwe poging.
        setLoading(true);

        try {
            // Roep de login functie uit de AuthContext aan, die de API-call afhandelt.
            await login({ email, password });

            // Bepaal waar de gebruiker naartoe gestuurd moet worden.
            // Als de gebruiker van een beveiligde pagina kwam, stuur hem daar terug naartoe.
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });

        } catch (err) {
            // Vang fouten van de API-call op en toon een duidelijke melding.
            setError('Inloggen is mislukt. Controleer je e-mailadres en wachtwoord.');
            console.error('Login Fout:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="form">
                <h2>Inloggen</h2>
                <p>Log in op je DiCo-account om verder te gaan.</p>

                <div className="input-group">
                    <label htmlFor="email">E-mailadres</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Wachtwoord</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>

                {/* Toon de foutmelding in de UI. */}
                {error && <p className="error">{error}</p>}

                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? 'Bezig met inloggen...' : 'Inloggen'}
                </button>

                <div className="footer-text">
                    Nog geen account? <Link to="/register">Maak er hier een aan</Link>.
                </div>
            </form>
        </div>
    );
}
