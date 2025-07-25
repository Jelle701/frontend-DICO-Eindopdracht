import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// FIX: Gebruik een relatief pad zodat Vite het bestand kan vinden.
import { registerUser } from '../../../services/AuthService/AuthService.jsx';
import './RegisterPage.css';

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '', // Keep this name for the form state, it's descriptive
        password: '',
        confirmPassword: '',
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

        if (formData.password !== formData.confirmPassword) {
            setError('Wachtwoorden komen niet overeen.');
            return;
        }

        // Destructure the form data to separate the fields.
        const { confirmPassword, dateOfBirth, ...rest } = formData;

        // Create the final data object for the API,
        // mapping `dateOfBirth` from the form to `dob` for the API.
        const registrationData = {
            ...rest,
            dob: dateOfBirth,
        };

        const { data, error: apiError } = await registerUser(registrationData);

        if (apiError) {
            setError(apiError.message || 'Registratie mislukt. Probeer het opnieuw.');
            console.error('Registration error:', apiError);
        } else {
            localStorage.setItem('userEmail', formData.email);
            navigate('/verify');
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
                    <label htmlFor="dateOfBirth">Geboortedatum</label>
                    <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Wachtwoord</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="confirmPassword">Herhaal Wachtwoord</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
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