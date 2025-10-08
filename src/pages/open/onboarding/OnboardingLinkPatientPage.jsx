import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/ApiClient';
import Navbar from '../../../components/web components/Navbar.jsx';
import '../../../styles/AuthForm.css'; // Importeer de nieuwe centrale stylesheet

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
            // CORRECTIE: De overbodige '/api' is verwijderd.
            await apiClient.post('/guardian/link-patient', { 
                accessCode: accessCode 
            });

            // Navigeer naar de portal na een succesvolle koppeling
            navigate('/patient-portal');

        } catch (err) {
            // Verbeterde foutafhandeling volgens de nieuwe backend-standaard
            if (err.response && err.response.data && err.response.data.message) {
                // Gebruik de specifieke foutmelding van de backend
                setError(err.response.data.message);
            } else if (err.request) {
                // Netwerkfout
                setError('Kan de server niet bereiken. Controleer je internetverbinding.');
            } else {
                // Andere onverwachte fouten
                setError('Er is een onbekende fout opgetreden. Probeer het later opnieuw.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page-container"> {/* Gebruik de nieuwe container class */}
                <div className="auth-form-card"> {/* Gebruik de nieuwe formulier card class */}
                    <form onSubmit={handleSubmit}>
                        <h1>Koppel aan Patiënt</h1>
                        <p className="auth-form-description">Voer de unieke toegangscode in die u van de patiënt heeft ontvangen.</p> {/* Gebruik de nieuwe description class */}
                        
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
