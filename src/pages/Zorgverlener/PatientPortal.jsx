import React, { useState, useEffect, useCallback } from 'react';
import { getLinkedPatients, linkPatientToProvider } from '../../services/ProviderService';
import Navbar from '../../components/Navbar.jsx';
import './PatientPortal.css';

function PatientPortal() {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
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
            <div className="patient-portal-container page--dark">
                <aside className="patient-list-sidebar">
                    <header className="sidebar-header">
                        <h2>Patiënten</h2>
                        <button onClick={() => setShowAddPatientModal(true)} className="btn btn--ghost">
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

                <main className="patient-detail-content card">
                    {selectedPatient ? (
                        <>
                            <header className="detail-header">
                                <h1>{selectedPatient.firstName} {selectedPatient.lastName}</h1>
                            </header>
                            <div className="details-grid">
                                <div className="detail-item"><span>Email</span><strong>{selectedPatient.email}</strong></div>
                                <div className="detail-item"><span>Geboortedatum</span><strong>{selectedPatient.dateOfBirth ? new Date(selectedPatient.dateOfBirth).toLocaleDateString('nl-NL') : 'N/A'}</strong></div>
                                <div className="detail-item"><span>Geslacht</span><strong>{selectedPatient.gender || 'N/A'}</strong></div>
                                <div className="detail-item"><span>Diabetes Type</span><strong>{selectedPatient.diabetesType || 'N/A'}</strong></div>
                                <div className="detail-item"><span>Lengte</span><strong>{selectedPatient.height ? `${selectedPatient.height} cm` : 'N/A'}</strong></div>
                                <div className="detail-item"><span>Gewicht</span><strong>{selectedPatient.weight ? `${selectedPatient.weight} kg` : 'N/A'}</strong></div>
                                <div className="detail-item"><span>Langwerkende Insuline</span><strong>{selectedPatient.longActingInsulin || 'N/A'}</strong></div>
                                <div className="detail-item"><span>Kortwerkende Insuline</span><strong>{selectedPatient.shortActingInsulin || 'N/A'}</strong></div>
                            </div>
                        </>
                    ) : (
                        !loading && <div className="no-patient-selected"><h2>Selecteer een patiënt</h2><p>Klik op een naam in de lijst om de details te bekijken.</p></div>
                    )}
                </main>

                {showAddPatientModal && (
                    <div className="modal-overlay">
                        <div className="modal-content card">
                            <h2>Nieuwe Patiënt Koppelen</h2>
                            <form onSubmit={handleAddPatient}>
                                <p>Voer de unieke toegangscode in die u van de patiënt heeft ontvangen.</p>
                                <div className="form-group">
                                    <label htmlFor="patient-code">Toegangscode</label>
                                    <input
                                        id="patient-code"
                                        type="text"
                                        value={newPatientCode}
                                        onChange={(e) => setNewPatientCode(e.target.value)}
                                        placeholder="bv. ABC-123-XYZ"
                                        required
                                    />
                                </div>
                                {error && <p className="error-message">{error}</p>}
                                <div className="modal-actions">
                                    <button type="button" onClick={() => { setShowAddPatientModal(false); setError(''); }} className="btn">
                                        Annuleren
                                    </button>
                                    <button type="submit" className="btn btn--primary">
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
