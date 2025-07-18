// src/pages/open/register/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from 'src/services/api.jsx'; // Directe import van de API-functie
import Navbar from '../../../components/Navbar.jsx';
import './RegisterPage.css';

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== confirmPassword) {
            setError('Wachtwoorden komen niet overeen.');
            setLoading(false);
            return;
        }

        try {
            // Roep de API-service direct aan met het correcte data-object
            await registerUser(formData);
            // Stuur gebruiker naar de verificatiepagina met het e-mailadres
            navigate('/verify', { state: { email: formData.email } });
        } catch (err) {
            setError(err.message || 'Registratie mislukt. Het e-mailadres is mogelijk al in gebruik.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page container">
                <h1 className="text-center">Account aanmaken</h1>
                <form onSubmit={handleSubmit} className="form flex flex-col gap-4">
                    {/* Voornaam */}
                    <div className="form-group">
                        <label htmlFor="firstName">Voornaam</label>
                        <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    {/* Achternaam */}
                    <div className="form-group">
                        <label htmlFor="lastName">Achternaam</label>
                        <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    {/* Geboortedatum */}
                    <div className="form-group">
                        <label htmlFor="dob">Geboortedatum</label>
                        <input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
                    </div>
                    {/* E-mail */}
                    <div className="form-group">
                        <label htmlFor="email">E-mailadres</label>
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    {/* Wachtwoord */}
                    <div className="form-group">
                        <label htmlFor="password">Wachtwoord</label>
                        <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    {/* Herhaal wachtwoord */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Herhaal wachtwoord</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Registreren...' : 'Registreer'}
                    </button>
                </form>
            </div>
        </>
    );
}

export default RegisterPage;