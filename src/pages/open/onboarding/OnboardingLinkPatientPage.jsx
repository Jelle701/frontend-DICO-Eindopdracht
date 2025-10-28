import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import the new, centralized service function
import { linkPatient } from '../../../services/ProviderService.jsx';
import Navbar from '../../../components/web components/Navbar.jsx';
import '../../../styles/AuthForm.css';

function OnboardingLinkPatientPage() {
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!accessCode) {
            setError('Voer de toegangscode in.');
            setLoading(false);
            return;
        }

        try {
            // Use the new, centralized service function
            const { error: apiError } = await linkPatient(accessCode);

            if (apiError) {
                throw apiError;
            }

            // Navigeer naar de portal na een succesvolle koppeling
            navigate('/patient-portal');

        } catch (err) {
            // Use the standardized error message from the service
            setError(err.message || 'Er is een onbekende fout opgetreden. Probeer het later opnieuw.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page-container">
                <div className="auth-form-card">
                    <form onSubmit={handleSubmit}>
                        <h1>Koppel aan Patiënt</h1>
                        <p className="auth-form-description">Voer de unieke toegangscode in die u van de patiënt heeft ontvangen.</p>
                        
                        <div className="input-group">
                            <label htmlFor="code">Toegangscode</label>
                            <input
                                id="code"
                                type="text"
                                name="code"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                placeholder="bv. 123456"
                                required
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" disabled={loading} className="btn btn--primary form-action-button">
                            {loading ? 'Bezig met koppelen...' : 'Koppel Patiënt'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default OnboardingLinkPatientPage;
