// src/pages/open/register/VerifyEmailPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from 'src/contexts/UserContext.jsx';
import Navbar from '../../../components/Navbar.jsx';
import './RegisterPage.css';

function VerifyEmailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useUser();

    // Haal email en wachtwoord op uit de state die is meegestuurd
    const email = location.state?.email || '';
    const password = location.state?.password || '';

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    // Als er geen email/wachtwoord is, kan deze pagina niets doen. Stuur terug.
    useEffect(() => {
        if (!email || !password) {
            navigate('/register');
        }
    }, [email, password, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setIsVerifying(true);

        // Ontwikkelings-shortcut: code '123456' is altijd geldig.
        if (code.trim() !== '123456') {
            setError("De ingevoerde verificatiecode is incorrect.");
            setIsVerifying(false);
            return;
        }

        try {
            // Stap 1: Log de gebruiker in. De context handelt de state en token af.
            await login({ email, password });

            // Stap 2: Stuur de gebruiker nu expliciet naar de EERSTE onboarding-pagina.
            // Omdat de gebruiker nu is ingelogd, zal de PrivateRoute in App.jsx toegang verlenen.
            navigate('/register-details');

        } catch (err) {
            console.error("Automatisch inloggen na verificatie is mislukt:", err);
            setError('Verificatie gelukt, maar kon niet automatisch inloggen. Ga naar de inlogpagina.');
            setTimeout(() => navigate('/login'), 3000);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="auth-page container">
                <h1>Email verifiëren</h1>
                <p>Wij hebben een verificatiecode (voor nu: 123456) gestuurd naar <strong>{email}</strong>. Vul de code hieronder in:</p>
                <form onSubmit={handleVerify} className="form flex flex-col gap-4">
                    <div className="form-group">
                        <label htmlFor="code">Verificatiecode</label>
                        <input
                            id="code"
                            name="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Vul de code in"
                            required
                        />
                    </div>
                    {error && <div className="error-text">{error}</div>}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isVerifying}
                    >
                        {isVerifying ? 'Bezig...' : 'Verifiëren en Doorgaan'}
                    </button>
                </form>
            </main>
        </>
    );
}

export default VerifyEmailPage;