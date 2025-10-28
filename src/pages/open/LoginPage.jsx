import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useUser } from '../../contexts/AuthContext.jsx';
import { loginUser } from '../../services/AuthService/AuthService.jsx';
import Navbar from '../../components/web components/Navbar.jsx';
import '../../styles/AuthForm.css';
import { ROLES } from '../../constants.js'; // Importeer de constanten

// Helper functie om e-mail te valideren
const isValidEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
};

// Robuuste helper functie om de rol te normaliseren
const normalizeRole = (role) => {
    if (typeof role !== 'string') return null;
    let normalized = role.toUpperCase(); // 1. Converteer naar hoofdletters
    if (normalized.startsWith('ROLE_')) { // 2. Verwijder prefix
        normalized = normalized.substring(5);
    }
    return normalized;
};

function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuth } = useAuth();
    const { user } = useUser();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Wacht tot de authenticatie is voltooid EN het user object is geladen.
        if (isAuth && user) {
            const userRole = normalizeRole(user.role);

            if (userRole) {
                switch (userRole) {
                    case ROLES.ADMIN:
                        navigate('/admin-dashboard', { replace: true });
                        break;
                    case ROLES.PATIENT:
                        navigate('/dashboard', { replace: true });
                        break;
                    case ROLES.GUARDIAN:
                        navigate('/guardian-portal', { replace: true });
                        break;
                    case ROLES.PROVIDER:
                        navigate('/provider-dashboard', { replace: true });
                        break;
                    default:
                        navigate('/', { replace: true });
                }
            } else {
                // Als de gebruiker wel is ingelogd maar geen rol heeft (bv. tijdens onboarding)
                navigate('/onboarding/role', { replace: true });
            }
        }
    }, [isAuth, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.email || !formData.password) {
            setError('Vul alsjeblieft zowel je e-mailadres als wachtwoord in.');
            setLoading(false);
            return;
        }

        if (!isValidEmail(formData.email)) {
            setError('Voer een geldig e-mailadres in.');
            setLoading(false);
            return;
        }

        const loginData = {
            email: formData.email,
            password: formData.password
        };

        const { data, error: apiError } = await loginUser(loginData);

        if (apiError) {
            setError(apiError.message || 'Er is een onbekende fout opgetreden.');
            setLoading(false);
        } else {
            login(data.jwt);
            // De useEffect hierboven handelt de navigatie af zodra de user state is bijgewerkt.
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page-container">
                <div className="auth-form-card">
                    <form onSubmit={handleSubmit}>
                        <h1>Inloggen</h1>
                        <p className="auth-form-description">Welkom terug! Log in om verder te gaan.</p>

                        <div className="input-group">
                            <label htmlFor="email">E-mailadres</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Wachtwoord</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="btn btn--primary form-action-button" disabled={loading}>
                            {loading ? 'Bezig met inloggen...' : 'Login'}
                        </button>

                        <div className="form-footer">
                            <p>
                                Nog geen account? <Link to="/register">Registreer hier</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
