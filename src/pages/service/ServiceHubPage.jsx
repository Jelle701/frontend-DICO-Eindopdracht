import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/web components/Navbar.jsx';
import apiClient from '../../services/ApiClient';
import './ServicesHubPage.css';
import '../Authorization/AccessCodeManagementPage.css'; // Voeg de extra CSS toe

function ServiceHubPage() {
    // State en logica van AccessCodeManagementPage
    const [accessCode, setAccessCode] = useState(null);
    const [loadingCode, setLoadingCode] = useState(true);
    const [errorCode, setErrorCode] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    const fetchAccessCode = async () => {
        setLoadingCode(true);
        setErrorCode('');
        try {
            const response = await apiClient.get('/patient/access-code');
            setAccessCode(response.data.accessCode);
        } catch (err) {
            if (err.response && err.response.status !== 404) {
                setErrorCode('Fout bij het ophalen van de toegangscode.');
            }
        } finally {
            setLoadingCode(false);
        }
    };

    const generateAccessCode = async () => {
        setLoadingCode(true);
        setErrorCode('');
        try {
            const response = await apiClient.post('/patient/access-code/generate');
            setAccessCode(response.data.accessCode);
        } catch (err) {
            setErrorCode('Fout bij het genereren van de code. Probeer het later opnieuw.');
        } finally {
            setLoadingCode(false);
        }
    };

    const copyToClipboard = () => {
        if (accessCode) {
            navigator.clipboard.writeText(accessCode).then(() => {
                setCopySuccess('Code gekopieerd!');
                setTimeout(() => setCopySuccess(''), 2000);
            }, () => {
                setErrorCode('Kopiëren mislukt.');
            });
        }
    };

    useEffect(() => {
        fetchAccessCode();
    }, []);

    return (
        <>
            <Navbar />
            <div className="services-page-container">
                <header className="services-header">
                    <h1>Services & Toegang</h1>
                    <p>Beheer hier uw externe koppelingen en deel uw data veilig.</p>
                </header>

                <main className="services-grid">
                    {/* --- NIEUW: Geïntegreerde Toegangscode Kaart --- */}
                    <div className="service-card access-management-card">
                        <h3 className="service-card-title">Deel Toegang met Zorgverlener</h3>
                        <p className="service-card-description">
                            Genereer een unieke code om uw zorgverlener of voogd alleen-lezen toegang te geven tot uw dashboard.
                        </p>
                        
                        {loadingCode && <p>Toegangscode laden...</p>}
                        {errorCode && <p className="error-text">{errorCode}</p>}

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
                                !loadingCode && <p>Er is nog geen code gegenereerd.</p>
                            )}
                        </div>

                        <button onClick={generateAccessCode} disabled={loadingCode} className="btn btn-primary generate-button">
                            {accessCode ? 'Genereer Nieuwe Code' : 'Genereer Toegangscode'}
                        </button>
                    </div>

                    {/* Bestaande service kaarten */}
                    <div className="service-card disabled">
                        <h3 className="service-card-title">Google Fit (Binnenkort)</h3>
                        <p className="service-card-description">
                            Synchroniseer uw activiteits- en gezondheidsgegevens.
                        </p>
                        <button className="btn" disabled>Binnenkort</button>
                    </div>

                    <div className="service-card disabled">
                        <h3 className="service-card-title">Samsung Health (Binnenkort)</h3>
                        <p className="service-card-description">
                            Synchroniseer uw activiteits- en gezondheidsgegevens.
                        </p>
                        <button className="btn" disabled>Binnenkort</button>
                    </div>

                    <div className="service-card disabled">
                        <h3 className="service-card-title">Dexcom (Binnenkort)</h3>
                        <p className="service-card-description">
                            Importeer uw CGM data direct.
                        </p>
                        <button className="btn" disabled>Binnenkort</button>
                    </div>
                </main>
            </div>
        </>
    );
}

export default ServiceHubPage;
