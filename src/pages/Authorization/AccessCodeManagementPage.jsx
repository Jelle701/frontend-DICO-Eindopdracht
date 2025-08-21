import React, { useState, useEffect } from 'react';
import apiClient from '../../services/ApiClient'; // Import the central client
import './AccessCodeManagementPage.css';

const AccessCodeManagementPage = () => {
    const [accessCode, setAccessCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    const fetchAccessCode = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.get('/api/patient/access-code'); // Updated endpoint
            setAccessCode(response.data.accessCode);
        } catch (err) {
            // Don't show an error if the code just doesn't exist yet (404)
            if (err.response && err.response.status !== 404) {
                setError('Fout bij het ophalen van de toegangscode.');
            }
        } finally {
            setLoading(false);
        }
    };

    const generateAccessCode = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await apiClient.post('/api/patient/access-code/generate'); // Updated endpoint
            setAccessCode(response.data.accessCode);
        } catch (err) {
            setError('Fout bij het genereren van de code. Probeer het later opnieuw.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (accessCode) {
            navigator.clipboard.writeText(accessCode).then(() => {
                setCopySuccess('Code gekopieerd!');
                setTimeout(() => setCopySuccess(''), 2000);
            }, () => {
                setError('Kopiëren mislukt.');
            });
        }
    };

    useEffect(() => {
        fetchAccessCode();
    }, []);

    return (
        <div className="access-code-container">
            <h2>Toegang Delen</h2>
            <p className="info-text">
                Deel de onderstaande code alleen met uw vertrouwde zorgverlener of ouder/voogd.
                Met deze code kunnen zij uw dashboard inzien, maar geen gegevens aanpassen.
            </p>

            {loading && <p>Aan het laden...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="code-display-section">
                {accessCode ? (
                    <>
                        <p>Uw unieke toegangscode:</p>
                        <div className="code-box">
                            <span>{accessCode}</span>
                            <button onClick={copyToClipboard} className="copy-button">Kopieer</button>
                        </div>
                        {copySuccess && <p className="copy-success-text">{copySuccess}</p>}
                    </>
                ) : (
                    !loading && <p>Er is nog geen code gegenereerd.</p>
                )}
            </div>

            <button onClick={generateAccessCode} disabled={loading} className="generate-button">
                {accessCode ? 'Genereer een Nieuwe Code' : 'Genereer Toegangscode'}
            </button>
        </div>
    );
};

export default AccessCodeManagementPage;
