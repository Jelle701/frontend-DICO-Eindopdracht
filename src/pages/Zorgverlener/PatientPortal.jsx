import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLinkedPatients, linkPatientToProvider, getDelegatedTokenForPatient } from '../../services/ProviderService';
import Navbar from '../../components/Navbar.jsx';
import './PatientPortal.css';

function PatientPortal() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddPatientModal, setShowAddPatientModal] = useState(false);
    const [newPatientCode, setNewPatientCode] = useState('');
    const navigate = useNavigate();

    const fetchPatients = useCallback(async () => {
        console.log('%cPatientPortal: Fetching patients...', 'color: blue;');
        setLoading(true);
        setError('');
        try {
            const { data, error: apiError } = await getLinkedPatients();
            if (apiError) throw apiError;
            console.log('%cPatientPortal: Patients fetched successfully:', 'color: green;', data);
            setPatients(data || []);
        } catch (err) {
            console.error('PatientPortal: Error fetching patients:', err);
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
        console.log(`%cPatientPortal: Attempting to link patient with code: ${newPatientCode}`, 'color: blue;');
        setError('');
        try {
            const { error: apiError } = await linkPatientToProvider(newPatientCode);
            if (apiError) throw apiError;
            
            console.log('%cPatientPortal: Patient linked successfully. Refreshing patient list...', 'color: green;');
            await fetchPatients();
            setShowAddPatientModal(false);
            setNewPatientCode('');
        } catch (err) {
            console.error('PatientPortal: Error linking patient:', err);
            setError(err.message || 'Kan patiënt niet toevoegen. Controleer de code.');
        }
    };

    const handleViewDashboard = async (patientId, patientUsername) => {
        console.log(`%cPatientPortal: Attempting to get delegated token for patientId: ${patientId}`, 'color: blue;');
        try {
            const { data, error: apiError } = await getDelegatedTokenForPatient(patientId);
            if (apiError) throw apiError;

            const { delegatedToken } = data;
            console.log('%cPatientPortal: Delegated token received:', 'color: green;', delegatedToken);

            sessionStorage.setItem('delegatedToken', delegatedToken);
            sessionStorage.setItem('patientUsername', patientUsername);

            console.log('PatientPortal: Navigating to /dashboard...');
            navigate('/dashboard');
        } catch (err) {
            console.error('PatientPortal: Error getting delegated token:', err);
            setError(err.message || 'Kon geen toegang krijgen tot het dashboard van de patiënt.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="patient-portal-container">
                <header className="portal-header">
                    <h1>Zorgverlenersportaal</h1>
                    <p>Beheer hier uw gekoppelde patiënten.</p>
                    <button onClick={() => setShowAddPatientModal(true)} className="btn btn-primary">
                        + Nieuwe Patiënt Koppelen
                    </button>
                </header>

                {loading && <p>Patiëntenlijst wordt geladen...</p>}
                {error && !showAddPatientModal && <p className="error-message">{error}</p>}

                <div className="patient-grid">
                    {!loading && patients.length > 0 ? (
                        patients.map(patient => (
                            <div key={patient.id} className="patient-card">
                                <h3>{patient.firstName} {patient.lastName}</h3>
                                <p>Email: {patient.email}</p>
                                <button 
                                    onClick={() => handleViewDashboard(patient.id, `${patient.firstName} ${patient.lastName}`)} 
                                    className="btn btn-secondary"
                                >
                                    Bekijk Dashboard
                                </button>
                            </div>
                        ))
                    ) : (
                        !loading && <p>U heeft nog geen patiënten gekoppeld.</p>
                    )}
                </div>

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
