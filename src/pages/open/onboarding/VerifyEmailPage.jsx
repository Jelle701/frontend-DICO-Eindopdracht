import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../../services/AuthService/AuthService';

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

            // Aangepast: Stuur de gebruiker na verificatie naar de loginpagina.
            // De login-logica bepaalt vervolgens de volgende stap (rol kiezen of dashboard).
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

    if (!userEmail) {
        return (
            <div>
                <h1>Fout</h1>
                <p>{error}</p>
                <button onClick={() => navigate('/register')}>Terug naar Registratie</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Verifieer je e-mailadres</h1>
            <p>We hebben een verificatiecode gestuurd naar <strong>{userEmail}</strong>.</p>
            <p>(Voor ontwikkelingsdoeleinden: controleer de backend-console voor de code).</p>
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Voer 6-cijferige code in"
                    maxLength="6"
                    required
                />
                <button type="submit" disabled={isLoading || token.length < 6}>
                    {isLoading ? 'Bezig met verifiëren...' : 'Verifieer'}
                </button>
            </form>

            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default VerifyEmailPage;