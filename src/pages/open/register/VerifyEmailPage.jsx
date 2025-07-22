import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
// CORRECTIE: Importeer de stylesheet direct.
import './RegisterPage.css';

function VerifyEmailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!location.state?.email) {
        return (
            <div className="auth-page">
                <p>Geen e-mailadres gevonden. Ga terug naar de <a href="/register">registratiepagina</a>.</p>
            </div>
        );
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        if (verificationCode !== '123456') {
            setError('De verificatiecode is onjuist.');
            return;
        }

        setLoading(true);
        try {
            const { email, password } = location.state;
            await login({ email, password });
            navigate('/register-details');
        } catch (err) {
            setError('Inloggen na verificatie is mislukt. Probeer het later opnieuw.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleVerify}>
                <h1>Verifieer je e-mailadres</h1>
                <p>We hebben een (dummy) code gestuurd naar <strong>{location.state.email}</strong>. Voer de 6-cijferige code hier in (tip: 123456).</p>
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Bezig...' : 'Verifiëren en doorgaan'}
                </button>
            </form>
        </div>
    );
}

export default VerifyEmailPage;
