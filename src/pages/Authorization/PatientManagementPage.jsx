/**
 * @file PatientManagementPage.jsx
 * @description This page serves as a dashboard for healthcare providers. It allows them to view a list of their linked
 * patients and to add new patients to their roster by entering a unique access code provided by the patient.
 *
 * @component
 * @returns {JSX.Element} The rendered patient management dashboard.
 *
 * @functions
 * - `PatientManagementPage()`: The main functional component. It manages the state for the patient list, loading/error states,
 *   and the visibility of the "add patient" modal.
 * - `fetchPatients()`: An asynchronous function (wrapped in `useCallback` for optimization) that retrieves the list of
 *   linked patients using the `getLinkedPatients` service and updates the component's state.
 * - `useEffect()`: A React hook that calls `fetchPatients` when the component first mounts to populate the patient list.
 * - `handleAddPatient(e)`: An asynchronous function that handles the form submission for adding a new patient. It calls
 *   the `linkPatientToProvider` service with the provided code, refreshes the patient list on success, and closes the modal.
 *   It also handles and displays errors within the modal for a better user experience.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { linkPatientToProvider, getLinkedPatients } from '../../services/ProviderService';
import './PatientManagementPage.css'; // We maken later een apart CSS-bestand

// Dit is het dashboard voor een ingelogde Zorgverlener.
function PatientManagementPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddPatientModal, setShowAddPatientModal] = useState(false);
    const [newPatientCode, setNewPatientCode] = useState('');

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data, error: apiError } = await getLinkedPatients();
            if (apiError) throw apiError;
            setPatients(data || []);
        } catch (err) {
            setError(err.message || 'Fout bij het ophalen van patiënten.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const handleAddPatient = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { error: apiError } = await linkPatientToProvider(newPatientCode);
            if (apiError) throw apiError;
            
            // Refresh de lijst na het toevoegen van een nieuwe patiënt
            await fetchPatients();
            setShowAddPatientModal(false);
            setNewPatientCode('');

        } catch (err) {
            // Toon de fout binnen de modal voor een betere UX
            setError(err.message || 'Kan patiënt niet toevoegen. Controleer de code.');
        }
    };

    return (
        <div className="patient-management-container">
            <header className="pm-header">
                <h1>Patiëntenbeheer</h1>
                <button onClick={() => setShowAddPatientModal(true)} className="btn btn-primary">
                    + Patiënt Toevoegen
                </button>
            </header>

            {loading && <p>Patiëntenlijst wordt geladen...</p>}
            {!loading && error && !showAddPatientModal && <p className="error-message">{error}</p>}

            <div className="patient-list">
                {!loading && patients.map(patient => (
                    <div key={patient.id} className="patient-card">
                        <h3>{patient.name}</h3>
                        <p>Laatste synchronisatie: {patient.lastSync || 'N.v.t.'}</p>
                        <button className="btn btn-secondary">Bekijk Dashboard</button>
                    </div>
                ))}
                {!loading && patients.length === 0 && <p>U heeft nog geen patiënten gekoppeld.</p>}
            </div>

            {showAddPatientModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Nieuwe Patiënt Toevoegen</h2>
                        <form onSubmit={handleAddPatient}>
                            <p>Voer de unieke toegangscode in die u van de patiënt heeft ontvangen.</p>
                            <div className="form-group">
                                <label htmlFor="patient-code">Toegangscode van Patiënt</label>
                                <input
                                    id="patient-code"
                                    type="text"
                                    value={newPatientCode}
                                    onChange={(e) => setNewPatientCode(e.target.value)}
                                    placeholder="bv. A7B-X9C-F4G"
                                    required
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <div className="modal-actions">
                                <button type="button" onClick={() => { setShowAddPatientModal(false); setError(''); }} className="btn btn-secondary">
                                    Annuleren
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Koppel Patiënt
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientManagementPage;
