import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from 'src/contexts/UserContext.jsx';
import Navbar from '../../../components/Navbar.jsx';
import 'src/App.css';

/**
 * Pagina voor e-mailverificatie na registratie.
 *
 * - Haalt het e-mailadres uit de Router state of UserContext
 * - Verstuurt de ingevoerde code naar de backend voor validatie
 * - Biedt de mogelijkheid om de verificatiecode opnieuw te sturen
 * - Navigeert naar de rol-keuzepagina bij succesvolle verificatie
 * - Staat altijd code '123456' toe voor eenvoud tijdens ontwikkeling
 */
function VerifyEmailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();

    // Haal email uit router state of uit UserContext als fallback
    const email = location.state?.email || user?.email || '';

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    // Stuur direct bij mount een eerste verificatie-email
    useEffect(() => {
        if (email) {
            resendCode();
        }
    }, [email]);

    /**
     * Verifieert de ingevoerde code of accepteert '123456'.
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setIsVerifying(true);

        // Snelpad voor ontwikkelaars: code 123456 altijd geldig
        if (code.trim() === '123456') {
            navigate('/register-details', { state: { email } });
            setIsVerifying(false);
            return;
        }

        try {
            const response = await fetch('/api/users/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Verificatie mislukt.');
            }
            navigate('/register-details', { state: { email } });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsVerifying(false);
        }
    };

    /**
     * Verstuurt een nieuwe verificatiecode naar het e-mailadres.
     */
    const resendCode = async () => {
        if (!email) return;
        setError('');
        setInfo('');
        setIsResending(true);

        try {
            const response = await fetch('/api/users/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Kon verificatiecode niet opnieuw verzenden.');
            }
            setInfo('Er is opnieuw een verificatiecode naar je e-mail gestuurd.');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="auth-page container">
                <h1>Email verifiëren</h1>
                <p>Wij hebben een verificatiecode gestuurd naar <strong>{email}</strong>. Vul de code hieronder in:</p>

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

                    {error && <div className="error-text" role="alert">{error}</div>}
                    {info && <div className="info-text">{info}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isVerifying || isResending}
                    >
                        {isVerifying ? 'Controleren...' : 'Verifiëren'}
                    </button>
                </form>

                <button
                    type="button"
                    className="btn btn-secondary mt-2"
                    onClick={resendCode}
                    disabled={isResending || isVerifying}
                >
                    {isResending ? 'Bezig...' : 'Code opnieuw verzenden'}
                </button>
            </main>
        </>
    );
}

export default VerifyEmailPage;