/**
 * @file GlucoseLogPage.jsx
 * @description This page provides a comprehensive logbook for a user's glucose measurements. It displays a list of all
 * recent measurements and includes a form to manually add new entries. This provides a more detailed historical view
 * compared to the main dashboard.
 *
 * @component
 * @returns {JSX.Element} The rendered glucose logbook page.
 *
 * @functions
 * - `getCurrentDate()`: A helper function that returns the current date in `YYYY-MM-DD` format.
 * - `getCurrentTime()`: A helper function that returns the current time in `HH:MM` format.
 * - `GlucoseLogPage()`: The main functional component that manages the state for the measurements list and the input form.
 * - `fetchMeasurements()`: An asynchronous function that retrieves all recent glucose measurements using the `getRecentGlucoseMeasurements` service.
 * - `useEffect()`: A React hook that calls `fetchMeasurements` once when the component mounts.
 * - `handleFormChange(e)`: Updates the state of the input form fields (value, date, time).
 * - `handleFormSubmit(e)`: Handles the submission of the new measurement form. It validates the input, combines the date
 *   and time into a timestamp, calls the `addGlucoseMeasurement` service, and provides user feedback. On success, it adds
 *   the new measurement to the top of the list for immediate UI feedback.
 * - `formatDate(isoString)`: A utility function to format an ISO timestamp into a user-friendly, localized date and time string.
 */
// src/pages/Authorization/GlucoseLogPage.jsx
import React, { useState, useEffect } from 'react';
import { getRecentGlucoseMeasurements, addGlucoseMeasurement } from '../../services/GlucoseService';
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

        // Combine date and time to a single ISO string
        const timestamp = new Date(`${formState.date}T${formState.time}`).toISOString();

        const payload = {
            value: parseFloat(formState.value),
            timestamp: timestamp,
        };

        const { data: newMeasurement, error: addError } = await addGlucoseMeasurement(payload);

        if (addError) {
            setFormError(addError.message);
        } else {
            // Add the new measurement to the top of the list for an immediate update
            setMeasurements(prev => [newMeasurement, ...prev]);
            // Reset the form to current date and time
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
        <div className="glucose-log-page">
            <h1>Glucose Logboek</h1>

            <div className="log-container">
                <div className="add-measurement-section">
                    <h2>Nieuwe Meting Toevoegen</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className="input-group">
                            <label htmlFor="value">Glucosewaarde (mmol/L)</label>
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
                            <label htmlFor="date">Datum</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formState.date}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="time">Tijd</label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formState.time}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        {formError && <p className="error-message">{formError}</p>}
                        <button type="submit" className="btn-primary">Opslaan</button>
                    </form>
                </div>

                <div className="measurement-list-section">
                    <h2>Recente Metingen</h2>
                    {loading && <p>Metingen worden geladen...</p>}
                    {error && <p className="error-message">Fout: {error}</p>}
                    {!loading && measurements.length === 0 && (
                        <p>Je hebt nog geen metingen toegevoegd.</p>
                    )}
                    <ul className="measurement-list">
                        {measurements.map(m => (
                            <li key={m.id} className="measurement-item">
                                <span className="measurement-value">{m.value.toFixed(1)} mmol/L</span>
                                <span className="measurement-time">{formatDate(m.timestamp)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default GlucoseLogPage;