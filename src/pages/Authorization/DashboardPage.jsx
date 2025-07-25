// src/pages/Authorization/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/AuthContext';
import { getRecentGlucoseMeasurements, addGlucoseMeasurement } from '../../services/GlucoseService'; // Functie toevoegen
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardPage.css';
import Navbar from "../../components/Navbar.jsx";

function DashboardPage() {
    const { user } = useUser();
    const [glucoseData, setGlucoseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- NIEUW: State voor het invoerformulier ---
    const [formState, setFormState] = useState({
        value: '',
        timestamp: new Date().toISOString().slice(0, 16), // Standaard op nu
    });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    // --- EINDE NIEUW ---

    const fetchMeasurements = async () => {
        setLoading(true);
        const { data, error: fetchError } = await getRecentGlucoseMeasurements();
        if (fetchError) {
            setError(fetchError.message);
        } else {
            const formattedData = data.map(m => ({
                ...m,
                time: new Date(m.timestamp).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' }),
            })).reverse();
            setGlucoseData(formattedData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMeasurements();
    }, []);

    // --- NIEUW: Functies voor het formulier ---
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

        const payload = {
            value: parseFloat(formState.value),
            timestamp: new Date(formState.timestamp).toISOString(),
        };

        const { data: newMeasurement, error: addError } = await addGlucoseMeasurement(payload);

        if (addError) {
            setFormError(addError.message);
        } else {
            setFormSuccess('Meting succesvol opgeslagen!');
            // Herlaad alle metingen om de grafiek correct te sorteren en bij te werken
            fetchMeasurements();
            // Reset het formulier
            setFormState({
                value: '',
                timestamp: new Date().toISOString().slice(0, 16),
            });
            // Laat het succesbericht even zien
            setTimeout(() => setFormSuccess(''), 3000);
        }
    };
    // --- EINDE NIEUW ---

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
        return <div className="dashboard-page"><h1>Dashboard wordt geladen...</h1></div>;
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
                    <h2>Recente Glucosemetingen (mmol/L)</h2>
                    {error && <p className="error-message">{error}</p>}
                    {!error && glucoseData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={glucoseData} margin={{top: 5, right: 20, left: -10, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)"/>
                                <XAxis dataKey="time"/>
                                <YAxis domain={['dataMin - 1', 'dataMax + 1']}/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="value" name="Glucose" stroke="#007bff" strokeWidth={2}
                                      activeDot={{r: 8}}/>
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no-data-placeholder">
                            <p>Geen glucose data beschikbaar om een grafiek te tonen.</p>
                            <p>Voeg hieronder je eerste meting toe!</p>
                        </div>
                    )}

                    {/* --- NIEUW: Snelle invoer formulier --- */}
                    <div className="quick-add-form">
                        <h3>Snelle Invoer</h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="value">Waarde (mmol/L)</label>
                                    <input
                                        type="number"
                                        id="value"
                                        name="value"
                                        value={formState.value}
                                        onChange={handleFormChange}
                                        step="0.1"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="timestamp">Datum en Tijd</label>
                                    <input
                                        type="datetime-local"
                                        id="timestamp"
                                        name="timestamp"
                                        value={formState.timestamp}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                            </div>
                            {formError && <p className="form-error">{formError}</p>}
                            {formSuccess && <p className="form-success">{formSuccess}</p>}
                            <button type="submit" className="btn-primary">Meting Opslaan</button>
                        </form>
                    </div>
                    {/* --- EINDE NIEUW --- */}

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