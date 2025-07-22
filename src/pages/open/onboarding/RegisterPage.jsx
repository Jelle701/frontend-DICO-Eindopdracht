import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../../services/ApiClient';
import './RegisterPage.css';

function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await apiClient.post('/register', formData);
            // Sla e-mail op voor de verificatiepagina
            localStorage.setItem('userEmail', formData.email);
            navigate('/verify');
        } catch (err) {
            setError(err.response?.data?.message || 'Registratie mislukt. Probeer het opnieuw.');
            console.error('Registration error:', err);
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Maak een account aan</h1>
                <div className="input-group">
                    <label htmlFor="firstName">Voornaam</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="lastName">Achternaam</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">E-mailadres</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Wachtwoord</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Registreer</button>
                <p className="form-footer">
                    Heb je al een account? <Link to="/login">Log hier in</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;