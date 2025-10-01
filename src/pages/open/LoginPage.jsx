import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, useUser } from '../../contexts/AuthContext';
import { loginUser } from '../../services/AuthService/AuthService';
import Navbar from '../../components/Navbar.jsx';
import './Loginpage.css';

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
        if (isAuth && user) {
            console.log('[LoginPage] User authenticated, determining redirect...', user);
            if (user.role) {
                switch (user.role) {
                    case 'ADMIN':
                        console.log('[LoginPage] Admin user detected, redirecting to /admin/dashboard');
                        navigate('/admin/dashboard');
                        break;
                    case 'PATIENT':
                        console.log('[LoginPage] Patient user detected, redirecting to /dashboard');
                        navigate('/dashboard');
                        break;
                    case 'GUARDIAN':
                        console.log('[LoginPage] Guardian user detected, redirecting to /onboarding/link-patient');
                        navigate('/onboarding/link-patient'); // Corrected route for Guardian
                        break;
                    case 'PROVIDER':
                        console.log('[LoginPage] Provider user detected, redirecting to /provider-dashboard');
                        navigate('/provider-dashboard');
                        break;
                    default:
                        console.log(`[LoginPage] Unknown role ${user.role}, redirecting to /`);
                        navigate('/');
                }
            } else {
                console.log('[LoginPage] User has no role, redirecting to onboarding');
                navigate('/onboarding/role');
            }
        } else if (isAuth && user === null) {
            console.log('[LoginPage] Auth is ready, but user object is pending...');
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
