import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/AuthContext.jsx';
import { getRecentGlucoseMeasurements, addGlucoseMeasurement } from '../../services/GlucoseService.jsx';
import { getDiabetesSummary } from '../../services/DiabetesService.jsx'; // Import new service
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardPage.css';
import Navbar from "../../components/web components/Navbar.jsx";
import DiabeticRapportValues from "../../components/DiabeticRapportValues.jsx";
import "../../components/DiabeticRapportValues.css";

const getInitialDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localNow = new Date(now.getTime() - (offset * 60 * 1000));
    return {
        date: localNow.toISOString().split('T')[0],
        time: localNow.toISOString().substring(11, 16),
    };
};

// Helper functies voor de grafiek
const getStartDate = (range) => {
    const now = new Date();
    switch (range) {
        case '6h': return new Date(now.getTime() - 6 * 60 * 60 * 1000);
        case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
        case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case '180d': return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        default: return new Date(now.getTime() - 6 * 60 * 60 * 1000);
    }
};

const getChartTitle = (range) => {
    const titles = {
        '6h': 'Glucoseverloop (laatste 6 uur)',
        '24h': 'Glucoseverloop (laatste 24 uur)',
        '7d': 'Glucoseverloop (laatste 7 dagen)',
        '30d': 'Glucoseverloop (laatste 30 dagen)',
        '180d': 'Glucoseverloop (laatste 6 maanden)',
    };
    return titles[range] || 'Glucoseverloop';
};

const timeFormatter = (timestamp, range) => {
    const date = new Date(timestamp);
    switch (range) {
        case '6h':
        case '24h':
            return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
        case '7d':
            return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
        default:
            return date.toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' });
    }
};


function DashboardPage() {
    const { user, loading: userLoading } = useUser();
    
    // State for glucose measurements chart
    const [glucoseData, setGlucoseData] = useState([]);
    const [rawMeasurements, setRawMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('6h');

    // State for diabetes summary report
    const [summaryData, setSummaryData] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [summaryError, setSummaryError] = useState('');

    const isDelegatedView = !!sessionStorage.getItem('delegatedToken');
    const patientUsername = sessionStorage.getItem('patientUsername');

    const [formState, setFormState] = useState({ value: '', ...getInitialDateTime() });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const fetchAllData = async () => {
        // Fetch glucose measurements
        setLoading(true);
        setError('');
        try {
            const { data } = await getRecentGlucoseMeasurements();
            setRawMeasurements(data || []);
        } catch (fetchError) {
            setError(fetchError.message || 'Kon metingen niet ophalen.');
            setRawMeasurements([]);
        } finally {
            setLoading(false);
        }

        // Fetch diabetes summary
        setSummaryLoading(true);
        setSummaryError('');
        try {
            const summary = await getDiabetesSummary();
            setSummaryData(summary);
        } catch (fetchError) {
            setSummaryError(fetchError.message || 'Kon samenvatting niet ophalen.');
            setSummaryData(null);
        } finally {
            setSummaryLoading(false);
        }
    };

    useEffect(() => {
        if (isDelegatedView || user) {
            fetchAllData();
            if (!isDelegatedView) {
                const intervalId = setInterval(fetchAllData, 60000);
                return () => clearInterval(intervalId);
            }
        }
    }, [user, isDelegatedView]);

    // Effect to update chart data when raw data or time range changes
    useEffect(() => {
        if (rawMeasurements.length > 0) {
            const startDate = getStartDate(timeRange);
            const filteredMeasurements = rawMeasurements.filter(m => new Date(m.timestamp) >= startDate);

            const chartData = filteredMeasurements
                .map(m => ({ 
                    time: timeFormatter(m.timestamp, timeRange),
                    value: m.value, 
                    timestamp: m.timestamp 
                }))
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            setGlucoseData(chartData);
        } else {
            setGlucoseData([]);
        }
    }, [rawMeasurements, timeRange]);

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
            fetchAllData(); // Refetch all data after adding a new measurement
            setFormState({ value: '', ...getInitialDateTime() });
            setTimeout(() => setFormSuccess(''), 3000);
        } catch (addError) {
            setFormError(addError.message || 'Kon meting niet opslaan.');
        }
    };

    const formatDate = (isoString) => new Date(isoString).toLocaleString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (userLoading) {
        return (
            <>
                <Navbar />
                <div className="dashboard-page"><h1>Authenticatie controleren...</h1></div>
            </>
        );
    }

    const timeRangeOptions = [
        { key: '6h', label: '6U' },
        { key: '24h', label: '24U' },
        { key: '7d', label: '7D' },
        { key: '30d', label: '1M' },
        { key: '180d', label: '6M' },
    ];

    return (
        <>
            <Navbar />
            <div className="dashboard-page">
                <header className="dashboard-header">
                    <h1>{isDelegatedView ? `Dashboard van ${patientUsername}` : `Welkom terug, ${user?.firstName || 'gebruiker'}!`}</h1>
                    <p>{isDelegatedView ? 'U bekijkt deze gegevens als zorgverlener of ouder/voogd.' : 'Hier is een overzicht van je recente activiteit en gegevens.'}</p>
                </header>

                <main className="dashboard-layout">
                    <div className="chart-container">
                        <h2>{getChartTitle(timeRange)}</h2>

                        <div className="time-range-selector">
                            {timeRangeOptions.map(option => (
                                <button 
                                    key={option.key} 
                                    onClick={() => setTimeRange(option.key)} 
                                    className={timeRange === option.key ? 'active' : ''}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {error && <p className="error-message">{error}</p>}
                        {loading ? <p>Metingen laden...</p> : (
                            glucoseData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={glucoseData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                        <XAxis dataKey="time" interval="preserveStartEnd" />
                                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} allowDecimals={false} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="value" name="Glucose" stroke="var(--color-teal)" strokeWidth={2} activeDot={{ r: 8 }} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="no-data-placeholder"><p>Geen metingen in de geselecteerde periode.</p></div>
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
                                    <button type="submit" className="btn btn--primary">Nu Opslaan</button>
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

                    <div className="summary-container">
                        {summaryLoading ? (
                            <p>Samenvatting laden...</p>
                        ) : summaryError ? (
                            <p className="error-message">{summaryError}</p>
                        ) : summaryData ? (
                            <DiabeticRapportValues data={summaryData} title="Uw Diabetes Samenvatting" />
                        ) : (
                            <p>Geen samenvattingsgegevens beschikbaar.</p>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

export default DashboardPage;
