// src/pages/Authorization/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom'; // Importeren voor de link
import { getRecentGlucoseMeasurements, addGlucoseMeasurement } from '../../services/GlucoseService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardPage.css';
import Navbar from "../../components/Navbar.jsx";

const getInitialDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localNow = new Date(now.getTime() - (offset * 60 * 1000));
    const date = localNow.toISOString().split('T')[0];
    const time = localNow.toISOString().substring(11, 16);
    return { date, time };
};

function DashboardPage() {
    const { user } = useUser();
    const [glucoseData, setGlucoseData] = useState([]);
    const [rawMeasurements, setRawMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [patientData, setPatientData] = useState(null);

    // Check if this is a delegated view
    const delegatedToken = sessionStorage.getItem('delegated_token');
    const isDelegatedView = !!delegatedToken;

    const [formState, setFormState] = useState({ value: '', ...getInitialDateTime() });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const fetchMeasurements = async () => {
        setLoading(true);
        setError('');

        const { data, error: fetchError, patient } = await getRecentGlucoseMeasurements();

        if (fetchError) {
            setError(fetchError.message);
            setGlucoseData([]);
            setRawMeasurements([]);
        } else if (data && data.length > 0) {
            setRawMeasurements(data);
            setPatientData(patient); // Store patient data for display

            const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
            const recentMeasurements = data.filter(m => new Date(m.timestamp) >= sixHoursAgo);

            const chartData = recentMeasurements
                .map(m => ({ time: new Date(m.timestamp).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }), value: m.value, id: m.id }))
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            setGlucoseData(chartData);
        } else {
            setRawMeasurements([]);
            setGlucoseData([]);
            if (patient) setPatientData(patient); // Still show patient data if available
        }

        setLoading(false);
    };

    useEffect(() => {
        // For delegated view, user object from context might be null, so we fetch immediately.
        // For normal view, we wait for the user object to be loaded.
        if (isDelegatedView || user) {
            fetchMeasurements();
            if (!isDelegatedView) {
                const intervalId = setInterval(fetchMeasurements, 60000);
                return () => clearInterval(intervalId);
            }
        }
    }, [user, isDelegatedView]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');

        if (!formState.value || formState.value <= 0) {
            setFormError('Glucosewaarde moet een positief getal zijn.');
            return;
        }

        const timestamp = new Date(`${formState.date}T${formState.time}:00`).toISOString();
        const payload = { value: parseFloat(formState.value), timestamp: timestamp };
        const { error: addError } = await addGlucoseMeasurement(payload);

        if (addError) {
            setFormError(addError.message);
        } else {
            setFormSuccess('Meting succesvol opgeslagen!');
            fetchMeasurements();
            setFormState({ value: '', ...getInitialDateTime() });
            setTimeout(() => setFormSuccess(''), 3000);
        }
    };

    const formatDate = (isoString) => new Date(isoString).toLocaleString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const displayUser = isDelegatedView ? patientData : user;

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="dashboard-page"><h1>Dashboard wordt geladen...</h1></div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="dashboard-page">
                <header className="dashboard-header">
                    <h1>{isDelegatedView ? `Dashboard van ${displayUser?.firstName || 'patiënt'}` : `Welkom terug, ${displayUser?.firstName}!`}</h1>
                    <p>{isDelegatedView ? 'U bekijkt deze gegevens als zorgverlener of ouder/voogd.' : 'Hier is een overzicht van je recente activiteit en gegevens.'}</p>
                </header>

                <main className="dashboard-layout">
                    <div className="chart-container">
                        <h2>Glucoseverloop (laatste 6 uur)</h2>
                        {error && <p className="error-message">{error}</p>}
                        {!error && glucoseData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={glucoseData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                                    <XAxis dataKey="time" />
                                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" name="Glucose" stroke="var(--color-accent-positive)" strokeWidth={2} activeDot={{ r: 8 }}/>
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="no-data-placeholder"><p>Geen metingen in de laatste 6 uur.</p></div>
                        )}

                        {!isDelegatedView && (
                            <div className="quick-add-form">
                                <h3>Snelle Invoer</h3>
                                <form onSubmit={handleFormSubmit}>
                                    <div className="form-row">
                                        <div className="input-group"><label htmlFor="value">Nieuwe Waarde (mmol/L)</label><input type="number" id="value" name="value" value={formState.value} onChange={handleFormChange} step="0.1" required placeholder="bv. 6.5"/></div>
                                        <div className="input-group"><label htmlFor="date">Datum</label><input type="date" id="date" name="date" value={formState.date} onChange={handleFormChange} required/></div>
                                        <div className="input-group"><label htmlFor="time">Tijd</label><input type="time" id="time" name="time" value={formState.time} onChange={handleFormChange} required/></div>
                                    </div>
                                    {formError && <p className="form-error">{formError}</p>}
                                    {formSuccess && <p className="form-success">{formSuccess}</p>}
                                    <button type="submit" className="btn-primary">Nu Opslaan</button>
                                </form>
                            </div>
                        )}

                        <div className="measurements-table-container">
                            <h3>Alle Recente Metingen</h3>
                            {rawMeasurements.length > 0 ? (
                                <div className="table-wrapper">
                                    <table>
                                        <thead><tr><th>Waarde (mmol/L)</th><th>Tijdstip</th></tr></thead>
                                        <tbody>{rawMeasurements.map((m) => (<tr key={m.id}><td>{m.value.toFixed(1)}</td><td>{formatDate(m.timestamp)}</td></tr>))}</tbody>
                                    </table>
                                </div>
                            ) : !loading && (<p>Geen metingen om weer te geven.</p>)}
                        </div>
                    </div>

                    <aside className="widgets-container">
                        {displayUser && (
                            <div className="widget-card">
                                <h3>Persoonlijke Gegevens</h3>
                                <ul>
                                    <li><span>Voornaam:</span><strong>{displayUser.firstName || 'N/A'}</strong></li>
                                    <li><span>Achternaam:</span><strong>{displayUser.lastName || 'N/A'}</strong></li>
                                    <li><span>Email:</span><strong>{displayUser.email || 'N/A'}</strong></li>
                                    <li><span>Geboortedatum:</span><strong>{displayUser.dob || 'N/A'}</strong></li>
                                </ul>
                            </div>
                        )}
                        
                        {!isDelegatedView && (
                             <div className="widget-card">
                                <h3>Accountbeheer</h3>
                                <Link to="/access-code-management" className="management-link">Toegang voor zorgverleners beheren</Link>
                            </div>
                        )}
                    </aside>
                </main>
            </div>
        </>
    );
}

export default DashboardPage;
