// src/pages/open/onboarding/VerifyEmailPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX 1: Use the custom hook and a relative path.
import { useAuth } from '../../../contexts/AuthContext';
// FIX 2: Use a relative path for the service as well.
import { verifyEmail } from '../../../services/AuthService/AuthService';
import './RegisterPage.css';

function VerifyEmailPage() {
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    // FIX 3: Use the custom hook for cleaner code.
    const { login } = useAuth();
    const navigate = useNavigate();

    // Effect to get the email when the page loads
    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setUserEmail(storedEmail);
        } else {
            // If there's no email, the user can't do anything here. Send them back.
            setError('Geen e-mailadres gevonden. U wordt teruggestuurd.');
            setTimeout(() => navigate('/register'), 3000);
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const verificationData = {
            email: userEmail,
            token: verificationCode, // The backend likely expects 'token'
        };

        // Use the robust { data, error } structure from AuthService
        const { data, error: apiError } = await verifyEmail(verificationData);

        setIsLoading(false);

        if (apiError) {
            // The error message now comes directly and neatly parsed from the service
            setError(apiError.message);
            console.error('Email verification error:', apiError);
        } else if (data && data.token) {
            // Success! Log the user in with the received token.
            await login(data.token); // It's good practice to await the login function
            localStorage.removeItem('userEmail');
            // The login function in AuthContext now handles navigation,
            // but we can keep this as a fallback if needed.
            // navigate('/register-details');
        } else {
            // Catch an unexpected but successful response from the server
            setError('Verificatie mislukt. Onverwacht antwoord van de server.');
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Verifieer je e-mailadres</h1>
                <p>
                    We hebben een code gestuurd naar <strong>{userEmail || 'jouw e-mailadres'}</strong>. Voer de 6-cijferige code in.
                </p>
                <div className="input-group">
                    <label htmlFor="verificationCode">Verificatiecode</label>
                    <input
                        type="text"
                        id="verificationCode"
                        name="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength="6"
                        required
                        disabled={isLoading || !userEmail} // Disable input while loading
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={isLoading || !userEmail}>
                    {isLoading ? 'Bezig met verifiëren...' : 'Verifiëren en doorgaan'}
                </button>
            </form>
        </div>
    );
}

export default VerifyEmailPage;