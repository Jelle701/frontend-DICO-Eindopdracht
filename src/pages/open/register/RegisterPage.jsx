import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../services/api'; // Zorg dat dit pad klopt
// CORRECTIE: Importeer de stylesheet direct.
import './RegisterPage.css';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.repeatPassword) {
            setError('Wachtwoorden komen niet overeen.');
            return;
        }

        setLoading(true);
        try {
            await registerUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });
            navigate('/verify', {
                state: { email: formData.email, password: formData.password }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Er is iets misgegaan bij de registratie.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Account aanmaken</h1>
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
                <div className="input-group">
                    <label htmlFor="repeatPassword">Herhaal Wachtwoord</label>
                    <input type="password" id="repeatPassword" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Bezig...' : 'Account aanmaken'}
                </button>
            </form>
        </div>
    );
}

export default RegisterPage;
