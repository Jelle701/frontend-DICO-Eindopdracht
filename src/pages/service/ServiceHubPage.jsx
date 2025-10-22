import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/web components/Navbar.jsx';
import apiClient from '../../services/ApiClient';
import { getUserServices, refreshLibreViewSession } from '../../services/UserService.jsx';
import { invalidateLibreViewSession, getLibreViewConnections } from '../../services/LibreView/LibreViewService.jsx';
import './ServicesHubPage.css';
import '../Authorization/AccessCodeManagementPage.css';

function ServiceHubPage() {
    // State voor Toegangscode
    const [accessCode, setAccessCode] = useState(null);
    const [loadingCode, setLoadingCode] = useState(true);
    const [errorCode, setErrorCode] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    // State voor LibreView
    const [libreViewStatus, setLibreViewStatus] = useState('loading'); // 'loading', 'linked_and_active', 'linked_but_expired', 'unlinked'
    const [libreViewInfo, setLibreViewInfo] = useState(null);
    const [libreViewLoading, setLibreViewLoading] = useState(false);
    const [libreViewMessage, setLibreViewMessage] = useState('');
    const location = useLocation();

    // Functies voor Toegangscode
    const fetchAccessCode = async () => {
        setLoadingCode(true);
        try {
            const response = await apiClient.get('/patient/access-code');
            setAccessCode(response.data.accessCode);
        } catch (err) {
            if (err.response && err.response.status !== 404) setErrorCode('Fout bij ophalen code.');
        } finally {
            setLoadingCode(false);
        }
    };

    const generateAccessCode = async () => {
        setLoadingCode(true);
        try {
            const response = await apiClient.post('/patient/access-code/generate');
            setAccessCode(response.data.accessCode);
        } catch (err) {
            setErrorCode('Fout bij genereren code.');
        } finally {
            setLoadingCode(false);
        }
    };

    const copyToClipboard = () => {
        if (accessCode) {
            navigator.clipboard.writeText(accessCode).then(() => setCopySuccess('Gekopieerd!'), () => setErrorCode('Kopiëren mislukt.'));
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    // Effect om de status van alle services op te halen
    useEffect(() => {
        const checkServiceStatus = async () => {
            setLibreViewStatus('loading');
            const { data, error } = await getUserServices();
            if (error) {
                setLibreViewStatus('unlinked');
                return;
            }
            const libreViewService = data.find(s => s.serviceName === 'LIBREVIEW');
            if (libreViewService && libreViewService.isConnected) {
                setLibreViewInfo(libreViewService);
                const { error: connectionError } = await getLibreViewConnections();
                if (connectionError) {
                    setLibreViewStatus('linked_but_expired');
                } else {
                    setLibreViewStatus('linked_and_active');
                }
            } else {
                setLibreViewStatus('unlinked');
            }
        };
        checkServiceStatus();

        if (location.state?.message) {
            setLibreViewMessage(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        fetchAccessCode();
    }, []);

    const handleRefreshSession = async () => {
        setLibreViewLoading(true);
        setLibreViewMessage('Sessie vernieuwen...');
        const { error } = await refreshLibreViewSession();
        if (error) {
            setLibreViewMessage('Kon sessie niet vernieuwen. Probeer opnieuw te koppelen.');
        } else {
            window.location.reload();
        }
        setLibreViewLoading(false);
    };

    return (
        <>
            <Navbar />
            <div className="services-page-container">
                <header className="services-header">
                    <h1>Services & Toegang</h1>
                    <p>Beheer hier uw externe koppelingen en deel uw data veilig.</p>
                </header>

                <main className="services-grid">
                    {/* --- Toegangscode Kaart (Hersteld) --- */}
                    <div className="service-card access-management-card">
                        <h3 className="service-card-title">Deel Toegang met Zorgverlener</h3>
                        <p className="service-card-description">Genereer een unieke code om uw zorgverlener of voogd alleen-lezen toegang te geven tot uw dashboard.</p>
                        {loadingCode ? <p>Toegangscode laden...</p> : errorCode ? <p className="error-text">{errorCode}</p> : (
                            <>
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
                                    ) : <p>Er is nog geen code gegenereerd.</p>}
                                </div>
                                <button onClick={generateAccessCode} disabled={loadingCode} className="btn btn--primary generate-button">
                                    {accessCode ? 'Genereer Nieuwe Code' : 'Genereer Toegangscode'}
                                </button>
                            </>
                        )}
                    </div>

                    {/* --- LibreView Integratie Kaart --- */}
                    <div className="service-card libreview-card">
                        <h3 className="service-card-title">LibreView Koppeling</h3>
                        <p className="service-card-description">Koppel uw LibreView-account om uw glucosemetingen automatisch te synchroniseren.</p>
                        {libreViewMessage && <p className="info-message">{libreViewMessage}</p>}
                        
                        {libreViewStatus === 'loading' && <p>Verbindingsstatus controleren...</p>}

                        {libreViewStatus === 'linked_and_active' && (
                            <div className="libreview-status">
                                <p>Status: <span className="status-dot connected"></span>Verbonden</p>
                                {libreViewInfo?.email && <p className="small text-300">Gekoppeld aan: <strong>{libreViewInfo.email}</strong></p>}
                                {libreViewInfo?.lastSync && <p className="small text-300">Laatste sync: {new Date(libreViewInfo.lastSync).toLocaleString('nl-NL')}</p>}
                                <Link to="/service-hub/libreview-login" className="btn btn--outline mt-4">Beheer Koppeling</Link>
                            </div>
                        )}

                        {libreViewStatus === 'linked_but_expired' && (
                            <div className="libreview-status">
                                <p>Status: <span className="status-dot warning"></span>Sessie Verlopen</p>
                                <p className="small text-300">Uw sessie is verlopen. Vernieuw de sessie om de synchronisatie te hervatten.</p>
                                <button onClick={handleRefreshSession} disabled={libreViewLoading} className="btn btn--primary mt-4">
                                    {libreViewLoading ? 'Bezig...' : 'Sessie Vernieuwen'}
                                </button>
                            </div>
                        )}

                        {libreViewStatus === 'unlinked' && (
                            <div className="libreview-status">
                                <p>Status: <span className="status-dot disconnected"></span>Niet verbonden</p>
                                <Link to="/service-hub/libreview-login" className="btn btn--primary mt-4">
                                    Koppel Account
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* --- Herstelde "Binnenkort" Kaarten --- */}
                    <div className="service-card disabled">
                        <h3 className="service-card-title">Google Fit (Binnenkort)</h3>
                        <p className="service-card-description">Synchroniseer uw activiteits- en gezondheidsgegevens.</p>
                        <button className="btn" disabled>Binnenkort</button>
                    </div>

                    <div className="service-card disabled">
                        <h3 className="service-card-title">Samsung Health (Binnenkort)</h3>
                        <p className="service-card-description">Synchroniseer uw activiteits- en gezondheidsgegevens.</p>
                        <button className="btn" disabled>Binnenkort</button>
                    </div>

                    <div className="service-card disabled">
                        <h3 className="service-card-title">Dexcom (Binnenkort)</h3>
                        <p className="service-card-description">Importeer uw CGM data direct.</p>
                        <button className="btn" disabled>Binnenkort</button>
                    </div>
                </main>
            </div>
        </>
    );
}

export default ServiceHubPage;
