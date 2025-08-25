/**
 * @file VerifyEmailPage.jsx
 * @description This page handles the email verification process for a new user. It prompts the user to enter a
 * verification code that was sent to their email address. The user's email is passed from the registration page
 * via the router's state.
 *
 * @component
 * @returns {JSX.Element} The rendered email verification page.
 *
 * @functions
 * - `VerifyEmailPage()`: The main functional component that renders the verification form and manages its state.
 * - `useEffect()`: A React hook that checks if the user's email is available from the route location state. If not,
 *   it sets an error to guide the user back to the registration page.
 * - `handleSubmit(e)`: An asynchronous function that handles the submission of the verification code. It calls the
 *   `verifyEmail` service and, upon success, displays a message and redirects the user to the login page after a short delay.
 *   It displays an error message if the verification fails.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../../services/AuthService/AuthService';
import Navbar from '../../../components/Navbar.jsx';
import './Onboarding.css'; // Zorgt ervoor dat de centrale onboarding styling wordt toegepast

const VerifyEmailPage = () => {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const isSubmitting = useRef(false);

    const userEmail = location.state?.email;

    useEffect(() => {
        if (!userEmail) {
            setError('Geen e-mailadres gevonden. Ga terug naar de registratiepagina.');
        }
    }, [userEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting.current) {
            return;
        }

        setIsLoading(true);
        isSubmitting.current = true;
        setError('');
        setMessage('');

        try {
            const { error: apiError } = await verifyEmail({ token });

            if (apiError) {
                throw apiError;
            }

            setMessage('Verificatie geslaagd! U wordt nu doorgestuurd om in te loggen.');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            console.error("Email verification error:", err);
            setError(err.message || 'Er is een onbekende fout opgetreden.');
        } finally {
            setIsLoading(false);
            isSubmitting.current = false;
        }
    };

    return (
        <>
            <Navbar />
            <div className="onboarding-page-container">
                <div className="auth-page">
                    {userEmail ? (
                        <form onSubmit={handleSubmit}>
                            <h1>Verifieer je e-mailadres</h1>
                            <p>We hebben een verificatiecode gestuurd naar <strong>{userEmail}</strong>.</p>
                            <p style={{color: 'var(--gray-400)', fontSize: '14px', marginTop: 'calc(-1 * var(--space-7))'}}>
                                (Voor ontwikkelingsdoeleinden: controleer de backend-console voor de code).
                            </p>
                            
                            <div className="input-group">
                                <label htmlFor="verificationCode">Verificatiecode</label>
                                <input
                                    type="text"
                                    id="verificationCode"
                                    name="verificationCode"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="Voer 6-cijferige code in"
                                    maxLength="6"
                                    required
                                />
                            </div>

                            {message && <p className="success-message">{message}</p>}
                            {error && <p className="error-message">{error}</p>}

                            <button type="submit" className="btn btn--primary form-action-button" disabled={isLoading || token.length < 6}>
                                {isLoading ? 'Bezig met verifiëren...' : 'Verifieer'}
                            </button>
                        </form>
                    ) : (
                        <div>
                            <h1>Fout</h1>
                            <p>{error}</p>
                            <button onClick={() => navigate('/register')} className="btn btn--primary form-action-button">
                                Terug naar Registratie
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default VerifyEmailPage;
