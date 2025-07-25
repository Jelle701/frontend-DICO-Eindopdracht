// src/pages/Authorization/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/AuthContext';
import { getRecentGlucoseMeasurements, addGlucoseMeasurement } from '../../services/GlucoseService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardPage.css';
import Navbar from "../../components/Navbar.jsx";

function DashboardPage() {
    const { user } = useUser();
    const [glucoseData, setGlucoseData] = useState([]);
    const [rawMeasurements, setRawMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // AANGEPAST: De timestamp is niet langer nodig in de formulier-state.
    const [formState, setFormState] = useState({
        value: '',
    });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const fetchMeasurements = async () => {
        setLoading(true);
        setError('');
        const { data, error: fetchError } = await getRecentGlucoseMeasurements();

        if (fetchError) {
            setError(fetchError.message);
            setGlucoseData([]);
            setRawMeasurements([]);
        } else if (data && data.length > 0) {
            // Sla de onbewerkte data op voor de tabel (nieuwste eerst)
            setRawMeasurements(data);

            // --- AANGEPAST: Logica voor de grafiek ---

            // 1. Bepaal het tijdstip van 6 uur geleden.
            const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

            // 2. Filter de metingen om alleen de laatste 6 uur te tonen.
            const recentMeasurements = data.filter(m => new Date(m.timestamp) >= sixHoursAgo);

            // 3. Sorteer van oud naar nieuw en formatteer voor de grafiek.
            const chartData = recentMeasurements
                .map(m => ({
                    // Formatteer de tijd voor een leesbare X-as
                    time: new Date(m.timestamp).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
                    value: m.value,
                }))
                .reverse(); // API levert nieuwste eerst, dus omdraaien voor de grafiek.

            setGlucoseData(chartData);
            // --- EINDE AANPASSING ---

        } else {
            setRawMeasurements([]);
            setGlucoseData([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Haal de data op bij het laden en stel een interval in om elke minuut te verversen.
        // Dit zorgt ervoor dat de "laatste 6 uur" filter relevant blijft.
        fetchMeasurements();
        const intervalId = setInterval(fetchMeasurements, 60000); // 60000 ms = 1 minuut

        // Ruim het interval op als de component wordt unmount.
        return () => clearInterval(intervalId);
    }, []);

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

        // AANGEPAST: Gebruik altijd de huidige tijd voor de timestamp.
        const payload = {
            value: parseFloat(formState.value),
            timestamp: new Date().toISOString(),
        };

        const { data: newMeasurement, error: addError } = await addGlucoseMeasurement(payload);

        if (addError) {
            setFormError(addError.message);
        } else {
            setFormSuccess('Meting succesvol opgeslagen!');
            fetchMeasurements();
            // AANGEPAST: Reset alleen de waarde, de timestamp is niet meer nodig.
            setFormState({ value: '' });
            setTimeout(() => setFormSuccess(''), 3000);
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderWidget = (title, data) => (
        <div className="widget-card">
            <h3>{title}</h3>
            <ul>
                {Object.entries(data).map(([key, value]) => (
                    <li key={key}>
                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                        <strong>{String(value) || 'N/A'}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );

    if (loading || !user) {
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
                    <h1>Welkom terug, {user.firstName}!</h1>
                    <p>Hier is een overzicht van je recente activiteit en gegevens.</p>
                </header>

                <main className="dashboard-layout">
                    <div className="chart-container">
                        {/* AANGEPAST: Titel van de grafiek */}
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
                                    {/* AANGEPAST: Naam in de legende */}
                                    <Line type="monotone" dataKey="value" name="Glucose" stroke="#007bff" strokeWidth={2} activeDot={{ r: 8 }}/>
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="no-data-placeholder">
                                <p>Geen metingen in de laatste 6 uur.</p>
                                <p>Voeg hieronder een nieuwe meting toe!</p>
                            </div>
                        )}

                        <div className="quick-add-form">
                            <h3>Snelle Invoer</h3>
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-row">
                                    <div className="input-group">
                                        <label htmlFor="value">Nieuwe Waarde (mmol/L)</label>
                                        <input
                                            type="number"
                                            id="value"
                                            name="value"
                                            value={formState.value}
                                            onChange={handleFormChange}
                                            step="0.1"
                                            required
                                            placeholder="bv. 6.5"
                                        />
                                    </div>
                                    {/* VERWIJDERD: De input voor datum en tijd is niet meer nodig. */}
                                </div>
                                {formError && <p className="form-error">{formError}</p>}
                                {formSuccess && <p className="form-success">{formSuccess}</p>}
                                <button type="submit" className="btn-primary">Nu Opslaan</button>
                            </form>
                        </div>

                        <div className="measurements-table-container">
                            <h3>Alle Recente Metingen</h3>
                            {rawMeasurements.length > 0 ? (
                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Waarde (mmol/L)</th>
                                            <th>Tijdstip</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {rawMeasurements.map((m) => (
                                            <tr key={m.id}>
                                                <td>{m.value.toFixed(1)}</td>
                                                <td>{formatDate(m.timestamp)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : !loading && (<p>Geen metingen om weer te geven.</p>)}
                        </div>
                    </div>

                    <aside className="widgets-container">
                        {user && renderWidget("Persoonlijke Gegevens", {
                            Voornaam: user.firstName,
                            Achternaam: user.lastName,
                            Email: user.email,
                            Geboortedatum: user.dob,
                        })}

                        {user.preferences && renderWidget("Voorkeuren", {
                            Gewicht: `${user.preferences.weight} kg`,
                            Lengte: `${user.preferences.height} cm`,
                            BMI: user.preferences.bmi,
                            Geslacht: user.preferences.gender,
                        })}

                        {user.medicineInfo && renderWidget("Medische Info", {
                            "Type Diabetes": user.medicineInfo.diabetesType,
                            "Langwerkende Insuline": user.medicineInfo.longActingInsulin,
                            "Kortwerkende Insuline": user.medicineInfo.shortActingInsulin,
                        })}

                        {user.diabeticDevices && user.diabeticDevices.length > 0 && (
                            <div className="widget-card">
                                <h3>Hulpmiddelen</h3>
                                {user.diabeticDevices.map((device, index) => (
                                    <div key={index} className="device-widget-item">
                                        <h4>{device.categorie}</h4>
                                        <p>{device.fabrikant} - {device.model}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </aside>
                </main>
            </div>
        </>
    );
}

export default DashboardPage;