/**
 * @file RegisterPage.jsx
 * @description This page provides a form for new users to create an account. It collects an email and password,
 * validates that the passwords match, and then calls the `registerUser` service. Upon successful registration,
 * it navigates the user to the email verification page.
 *
 * @component
 * @returns {JSX.Element} The rendered registration page component.
 *
 * @functions
 * - `RegisterPage()`: The main functional component that renders the registration form and manages its state.
 * - `handleChange(e)`: Updates the form state (email, password, confirmPassword) as the user types.
 * - `handleSubmit(e)`: Handles the form submission. It checks if the passwords match, calls the `registerUser`
 *   service, and either navigates to the verification page on success or displays an error message on failure.
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../../services/AuthService/AuthService.jsx';
import Navbar from '../../../components/Navbar.jsx';
import './Onboarding.css'; // Gebruik de nieuwe gedeelde CSS

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

        const { confirmPassword, ...registrationData } = formData;

        const { data, error: apiError } = await registerUser(registrationData);

        if (apiError) {
            setError(apiError.message || 'Registratie mislukt. Probeer het opnieuw.');
        } else {
            navigate('/verify', { state: { email: formData.email } });
        }
    };

    return (
        <>
            <Navbar />
            <div className="onboarding-page-container">
                <div className="auth-page">
                    <form onSubmit={handleSubmit}>
                        <h1>Maak een account aan</h1>
                        <p>Start je reis naar betere gezondheidsinzichten.</p>

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

                        <button type="submit" className="btn btn--primary form-action-button">
                            Registreer
                        </button>

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
