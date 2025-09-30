import React, { useState, useEffect, useCallback } from 'react';
import { getLinkedPatients, linkPatientToProvider } from '../../services/ProviderService';
import Navbar from '../../components/Navbar.jsx';
import './PatientPortal.css';

function PatientPortal() {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null); // NIEUW: Houdt de geselecteerde patiënt bij
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
            // Selecteer de eerste patiënt in de lijst als die er is
            if (data && data.length > 0) {
                setSelectedPatient(data[0]);
            }
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
            
            await fetchPatients();
            setShowAddPatientModal(false);
            setNewPatientCode('');
        } catch (err) {
            setError(err.message || 'Kan patiënt niet toevoegen. Controleer de code.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="patient-portal-container master-detail-layout">
                {/* --- Master View: Patiëntenlijst --- */}
                <aside className="patient-list-sidebar">
                    <header className="sidebar-header">
                        <h2>Gekoppelde Patiënten</h2>
                        <button onClick={() => setShowAddPatientModal(true)} className="btn btn-primary btn-sm">
                            + Koppelen
                        </button>
                    </header>
                    
                    {loading && <p>Laden...</p>}
                    {error && !showAddPatientModal && <p className="error-message">{error}</p>}

                    <div className="patient-list-items">
                        {!loading && patients.map(patient => (
                            <div 
                                key={patient.id}
                                className={`patient-list-item ${selectedPatient?.id === patient.id ? 'active' : ''}`}
                                onClick={() => setSelectedPatient(patient)}
                            >
                                <span>{patient.firstName} {patient.lastName}</span>
                            </div>
                        ))}
                        {!loading && patients.length === 0 && <p>Geen patiënten gekoppeld.</p>}
                    </div>
                </aside>

                {/* --- Detail View: Patiëntgegevens --- */}
                <main className="patient-detail-content">
                    {selectedPatient ? (
                        <>
                            <header className="detail-header">
                                <h1>{selectedPatient.firstName} {selectedPatient.lastName}</h1>
                                <p>Persoonlijke en medische gegevens</p>
                            </header>
                            <div className="details-grid">
                                <div className="detail-item"><strong>Email:</strong> {selectedPatient.email}</div>
                                <div className="detail-item"><strong>Geboortedatum:</strong> {selectedPatient.dateOfBirth ? new Date(selectedPatient.dateOfBirth).toLocaleDateString('nl-NL') : 'N/A'}</div>
                                <div className="detail-item"><strong>Geslacht:</strong> {selectedPatient.gender || 'N/A'}</div>
                                <div className="detail-item"><strong>Diabetes Type:</strong> {selectedPatient.diabetesType || 'N/A'}</div>
                                <div className="detail-item"><strong>Lengte:</strong> {selectedPatient.height ? `${selectedPatient.height} cm` : 'N/A'}</div>
                                <div className="detail-item"><strong>Gewicht:</strong> {selectedPatient.weight ? `${selectedPatient.weight} kg` : 'N/A'}</div>
                                <div className="detail-item"><strong>Langwerkende Insuline:</strong> {selectedPatient.longActingInsulin || 'N/A'}</div>
                                <div className="detail-item"><strong>Kortwerkende Insuline:</strong> {selectedPatient.shortActingInsulin || 'N/A'}</div>
                            </div>
                        </>
                    ) : (
                        !loading && <p>Selecteer een patiënt uit de lijst om de gegevens te bekijken.</p>
                    )}
                </main>

                {/* Modal voor het toevoegen van een nieuwe patiënt */}
                {showAddPatientModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Nieuwe Patiënt Koppelen</h2>
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
        </>
    );
}

export default PatientPortal;
