// src/pages/patient/GlucoseLogPage.jsx
import React, { useState, useEffect } from 'react';
import { getRecentGlucoseMeasurements, addGlucoseMeasurement } from '../../services/GlucoseService.jsx';
// The new, simplified CSS file will be imported.
import './GlucoseLogPage.css'; 

// Helper functions to format date and time
const getCurrentDate = () => new Date().toISOString().slice(0, 10);
const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

function GlucoseLogPage() {
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');

    const [formState, setFormState] = useState({
        value: '',
        date: getCurrentDate(),
        time: getCurrentTime(),
    });

    const fetchMeasurements = async () => {
        setLoading(true);
        const { data, error: fetchError } = await getRecentGlucoseMeasurements();
        if (fetchError) {
            setError(fetchError.message);
        } else {
            setMeasurements(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMeasurements();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!formState.value || formState.value <= 0) {
            setFormError('Glucosewaarde moet een positief getal zijn.');
            return;
        }

        const timestamp = new Date(`${formState.date}T${formState.time}`).toISOString();

        const payload = {
            value: parseFloat(formState.value),
            timestamp: timestamp,
        };

        const { data: newMeasurement, error: addError } = await addGlucoseMeasurement(payload);

        if (addError) {
            setFormError(addError.message);
        } else {
            setMeasurements(prev => [newMeasurement, ...prev]);
            setFormState({
                value: '',
                date: getCurrentDate(),
                time: getCurrentTime(),
            });
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

    return (
        // Use container for consistent padding and max-width
        <div className="container pt-6 pb-6"> 
            <h1 className="text-center">Glucose Logboek</h1>

            <div className="log-container">
                {/* Use the global 'card' class */}
                <div className="card">
                    <h3>Nieuwe Meting Toevoegen</h3>
                    <form onSubmit={handleFormSubmit}>
                        {/* Use margin utilities for spacing */}
                        <div className="mb-4">
                            <label className="label" htmlFor="value">Glucosewaarde (mmol/L)</label>
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
                        <div className="mb-4">
                            <label className="label" htmlFor="date">Datum</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formState.date}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="label" htmlFor="time">Tijd</label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formState.time}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        {formError && <p className="form-error">{formError}</p>}
                        {/* Use the global button classes */}
                        <button type="submit" className="btn btn--primary w-100">Opslaan</button>
                    </form>
                </div>

                {/* Use the global 'card' class */}
                <div className="card">
                    <h3>Recente Metingen</h3>
                    {loading && <p className="empty-state">Metingen worden geladen...</p>}
                    {error && <p className="form-error">Fout: {error}</p>}
                    {!loading && measurements.length === 0 && (
                        <p className="empty-state">Je hebt nog geen metingen toegevoegd.</p>
                    )}
                    {/* Use a div wrapper for scrolling, similar to DashboardPage */}
                    <div className="measurement-list-wrapper">
                        {measurements.map(m => (
                            // Use the global 'detail-item' class for list items
                            <div key={m.id} className="detail-item">
                                <span className="detail-item__value">{m.value.toFixed(1)} mmol/L</span>
                                <span className="detail-item__label">{formatDate(m.timestamp)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GlucoseLogPage;