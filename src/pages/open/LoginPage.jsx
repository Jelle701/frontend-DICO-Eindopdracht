/**
 * @file LoginPage.jsx
 * @description This page provides a form for users to log into their DICO account. It captures the user's email and
 * password, validates the input, and uses the AuthService to authenticate with the backend. Upon successful
 * authentication, the user is redirected to their dashboard.
 *
 * @component
 * @returns {JSX.Element} The rendered login page component.
 *
 * @functions
 * - `LoginPage()`: The main functional component that renders the login form and handles its state.
 * - `handleChange(e)`: Updates the form's state (email, password) as the user types in the input fields.
 * - `handleSubmit(e)`: Triggered on form submission. It prevents the default form action, performs basic validation,
 *   calls the `loginUser` service to authenticate, and then uses the `AuthContext` to set the user's session and
 *   redirect them to the dashboard. It displays an error message if the login fails.
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../services/AuthService/AuthService';
import Navbar from '../../components/Navbar.jsx';
import './onboarding/Onboarding.css'; // Gebruik de definitieve, gedeelde CSS

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

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

        if (!formData.email || !formData.password) {
            setError('Vul alsjeblieft zowel je e-mailadres als wachtwoord in.');
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
            await login(data.jwt, navigate);
        }
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

                        <button type="submit" className="btn btn--primary form-action-button">
                            Login
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
