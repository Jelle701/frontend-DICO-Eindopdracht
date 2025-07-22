import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'src/contexts/AuthContext';
import apiClient from 'src/services/ApiClient';
import './RegisterPage.css';

function VerifyEmailPage() {
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const email = localStorage.getItem('userEmail');

        // DIT IS EEN TIJDELIJKE OPLOSSING VOOR DE DEMO
        // In een echte applicatie zou je het email & de code naar de backend sturen voor validatie
        const password = "password123"; // Dummy wachtwoord omdat de backend dit nodig heeft voor de /login route

        if (verificationCode === '123456') { // Dummy code
            try {
                const response = await apiClient.post('/login', { email, password });
                login(response.data.token);
                localStorage.removeItem('userEmail');
                navigate('/register-details');
            } catch (err) {
                setError('Verificatie gelukt, maar inloggen mislukt. Probeer later opnieuw in te loggen.');
                console.error('Login na verificatie error:', err);
            }
        } else {
            setError('De ingevoerde code is onjuist.');
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Verifieer je e-mailadres</h1>
                <p>We hebben een code gestuurd naar <strong>{localStorage.getItem('userEmail')}</strong>. Voer de 6-cijferige code in (tip: 123456).</p>
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
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Verifiëren en doorgaan</button>
            </form>
        </div>
    );
}

export default VerifyEmailPage;