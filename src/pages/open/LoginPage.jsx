import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from 'src/services/ApiClient.jsx'; // <-- CORRECTED PATH
import { AuthContext } from 'src/contexts/AuthContext.jsx'; // <-- CORRECTED PATH
import './onboarding/RegisterPage.css'; // Corrected path to shared CSS

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Vul alsjeblieft zowel je e-mailadres als wachtwoord in.');
            return;
        }

        try {
            const response = await apiClient.post('/login', formData);
            if (response.data && response.data.token) {
                login(response.data.token); // The login function in AuthContext will handle navigation
            } else {
                setError('Inloggen mislukt. Geen token ontvangen.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Inloggen is mislukt. Controleer je gegevens.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Inloggen</h1>
                <div className="input-group">
                    <label htmlFor="email">E-mailadres</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
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
                        required
                        autoComplete="current-password"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Log in</button>
                <p className="form-footer">
                    Nog geen account? <Link to="/register">Registreer hier</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;