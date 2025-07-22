import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../../services/ApiClient';
import { AuthContext } from '../../../context/AuthContext';
import '../register/RegisterPage.css'; // Hergebruik van CSS is efficiënt

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

        try {
            const response = await apiClient.post('/login', formData);
            login(response.data.token); // Geef de token door aan de login functie
            navigate('/dashboard');
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