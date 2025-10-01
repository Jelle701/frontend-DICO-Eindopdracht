import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/ApiClient';
import Navbar from '../../../components/Navbar.jsx';
import './RegisterPage.css';

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
            await apiClient.post('/api/guardian/link-patient', { 
                accessCode: accessCode 
            });

            navigate('/patient-portal');

        } catch (err) {
            if (err.response && (err.response.status === 400 || err.response.status === 404)) {
                setError('De ingevoerde toegangscode is ongeldig of verlopen.');
            } else {
                setError('Er is een onbekende fout opgetreden. Probeer het later opnieuw.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="onboarding-page-container page--dark">
                <div className="auth-page card">
                    <form onSubmit={handleSubmit}>
                        <h1>Koppel aan Patiënt</h1>
                        <p>Voer de unieke toegangscode in die u van de patiënt heeft ontvangen.</p>
                        
                        <div className="input-group">
                            <label htmlFor="code">Toegangscode</label>
                            <input
                                id="code"
                                type="text"
                                name="code"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                placeholder="bv. ABC-123-XYZ"
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
