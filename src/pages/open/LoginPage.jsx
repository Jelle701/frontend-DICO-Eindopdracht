import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useUser } from '../../contexts/AuthContext'; // Importeer ook useUser
import { loginUser } from '../../services/AuthService/AuthService';
import Navbar from '../../components/Navbar.jsx';
import './Loginpage.css';
function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuth } = useAuth();
    const { user } = useUser(); // Haal de user op om de rol te kunnen checken

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // DE FIX: Deze useEffect handelt de navigatie af ZODRA de gebruiker is ingelogd
    useEffect(() => {
        // Wacht tot de authenticatie is afgerond en de user-data is geladen.
        if (isAuth && user) {
            if (user.role) {
                // Als de gebruiker een rol heeft, stuur naar de juiste pagina.
                switch (user.role) {
                    case 'PATIENT':
                        navigate('/dashboard');
                        break;
                    case 'GUARDIAN':
                        navigate('/guardian-dashboard'); // Moet later een echt dashboard worden
                        break;
                    case 'PROVIDER':
                        navigate('/patient-management');
                        break;
                    default:
                        navigate('/'); // Fallback naar homepage
                }
            } else {
                // Als de gebruiker nog geen rol heeft, stuur naar de rol-selectie pagina.
                navigate('/onboarding/role');
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

        const loginData = {
            username: formData.email,
            password: formData.password
        };

        const { data, error: apiError } = await loginUser(loginData);

        if (apiError) {
            setError(apiError.message || 'Er is een onbekende fout opgetreden.');
        } else {
            // De login functie slaat nu alleen het token op. De useEffect hierboven doet de rest.
            login(data.jwt);
        }
        setLoading(false);
    };

    return (
        <>
            <Navbar />
            <div className="onboarding-page-container">
                <div className="auth-page">
                    <form onSubmit={handleSubmit}>
                        <h1>Inloggen</h1>
                        <p>Welkom terug! Log in om verder te gaan.</p>

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
