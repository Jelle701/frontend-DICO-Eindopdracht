import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../../services/AuthService/AuthService.jsx';
import Navbar from '../../../components/Navbar.jsx'; // Importeer de Navbar
import '../../../styles/AuthForm.css'; // Importeer de nieuwe centrale stylesheet

// Stap 1 van de nieuwe flow: Een generiek account aanmaken.
function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
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

        // Verwijder confirmPassword uit de data die naar de backend wordt gestuurd.
        const { confirmPassword, ...registrationData } = formData;

        const { data, error: apiError } = await registerUser(registrationData);

        if (apiError) {
            setError(apiError.message || 'Registratie mislukt. Probeer het opnieuw.');
            console.error('Registration error:', apiError);
        } else {
            // Geef de email mee aan de verificatiepagina.
            navigate('/verify', { state: { email: formData.email } });
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page-container"> {/* Gebruik de nieuwe container class */}
                <div className="auth-form-card"> {/* Gebruik de nieuwe formulier card class */}
                    <form onSubmit={handleSubmit}>
                        <h1>Maak een account aan</h1>
                        <p className="auth-form-description">Stap 1: Registreer uw e-mailadres en wachtwoord.</p> {/* Gebruik de nieuwe description class */}
                        <div className="input-group">
                            <label htmlFor="email">E-mailadres</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
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
                        <button type="submit" className="btn btn--primary form-action-button">Registreer</button>
                        <div className="form-footer">
                            <p>
                                Heb je al een account? <Link to="/login">Log hier in</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;
