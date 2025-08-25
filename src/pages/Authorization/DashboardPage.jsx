/**
 * @file DashboardPage.jsx
 * @description This is the main dashboard for an authenticated user. It displays recent glucose measurements,
 * provides a form for quick manual entry of new data, and shows a table of all recent measurements.
 * The page also supports a "delegated view" for caregivers or guardians, which provides a read-only view
 * of the patient's data.
 *
 * @component
 * @returns {JSX.Element} The rendered dashboard component.
 *
 * @functions
 * - `getInitialDateTime()`: A helper function that returns the current local date and time, formatted for use in the
 *   "quick add" form's default state.
 * - `DashboardPage()`: The main functional component that orchestrates the fetching, display, and submission of glucose data.
 * - `fetchMeasurements()`: An asynchronous function that calls the `getRecentGlucoseMeasurements` service to retrieve
 *   the latest data, processes it for the chart and table, and updates the component's state.
 * - `useEffect()`: A React hook that triggers `fetchMeasurements` when the component mounts. For the patient's own view,
 *   it also sets up a one-minute interval to automatically refresh the data.
 * - `handleFormChange(e)`: Updates the state of the "quick add" form fields as the user types.
 * - `handleFormSubmit(e)`: Handles the submission of the "quick add" form. It validates the input, calls the
 *   `addGlucoseMeasurement` service, provides user feedback (success or error), and refreshes the data.
 * - `formatDate(isoString)`: A utility function to format an ISO timestamp into a user-friendly, localized date and time string.
 */
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getRecentGlucoseMeasurements, addGlucoseMeasurement } from '../../services/GlucoseService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardPage.css';
import Navbar from "../../components/Navbar.jsx";

const getInitialDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localNow = new Date(now.getTime() - (offset * 60 * 1000));
    return {
        date: localNow.toISOString().split('T')[0],
        time: localNow.toISOString().substring(11, 16),
    };
};

function DashboardPage() {
    const { user } = useUser();
    const [glucoseData, setGlucoseData] = useState([]);
    const [rawMeasurements, setRawMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Correctly check for delegated view using the right sessionStorage keys
    const isDelegatedView = !!sessionStorage.getItem('delegatedToken');
    const patientUsername = sessionStorage.getItem('patientUsername');

    const [formState, setFormState] = useState({ value: '', ...getInitialDateTime() });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const fetchMeasurements = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await getRecentGlucoseMeasurements();

            if (data && data.length > 0) {
                setRawMeasurements(data);
                const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
                const recentMeasurements = data.filter(m => new Date(m.timestamp) >= sixHoursAgo);

                const chartData = recentMeasurements
                    .map(m => ({ time: new Date(m.timestamp).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }), value: m.value }))
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setGlucoseData(chartData);
            } else {
                setRawMeasurements([]);
                setGlucoseData([]);
            }
        } catch (fetchError) {
            setError(fetchError.message || 'Kon metingen niet ophalen.');
            setGlucoseData([]);
            setRawMeasurements([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isDelegatedView || user) {
            fetchMeasurements();
            // Only set up the interval for the patient's own view
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
        const payload = { value: parseFloat(formState.value), timestamp };
        
        try {
            await addGlucoseMeasurement(payload);
            setFormSuccess('Meting succesvol opgeslagen!');
            fetchMeasurements(); // Refresh data after adding
            setFormState({ value: '', ...getInitialDateTime() });
            setTimeout(() => setFormSuccess(''), 3000);
        } catch (addError) {
            setFormError(addError.message || 'Kon meting niet opslaan.');
        }
    };

    const formatDate = (isoString) => new Date(isoString).toLocaleString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (loading && !user && !isDelegatedView) {
        return (
            <>
                <Navbar />
                <div className="dashboard-page"><h1>Authenticatie controleren...</h1></div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="dashboard-page">
                <header className="dashboard-header">
                    <h1>{isDelegatedView ? `Dashboard van ${patientUsername}` : `Welkom terug, ${user?.username}!`}</h1>
                    <p>{isDelegatedView ? 'U bekijkt deze gegevens als zorgverlener of ouder/voogd.' : 'Hier is een overzicht van je recente activiteit en gegevens.'}</p>
                </header>

                <main className="dashboard-layout">
                    <div className="chart-container">
                        <h2>Glucoseverloop (laatste 6 uur)</h2>
                        {error && <p className="error-message">{error}</p>}
                        {loading ? <p>Metingen laden...</p> : (
                            glucoseData.length > 0 ? (
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
                            )
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
                        {!isDelegatedView && user && (
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
