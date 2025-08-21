import React, { useState } from 'react';
import './PatientManagementPage.css'; // We maken later een apart CSS-bestand

// Placeholder data voor de patiëntenlijst
const initialPatients = [
    { id: 1, name: 'Jan Jansen', lastSync: 'Vandaag om 14:30' },
    { id: 2, name: 'Piet Pietersen', lastSync: 'Gisteren om 09:15' },
];

// Dit is het dashboard voor een ingelogde Zorgverlener.
function PatientManagementPage() {
    const [patients, setPatients] = useState(initialPatients);
    const [showAddPatientModal, setShowAddPatientModal] = useState(false);
    const [newPatientCode, setNewPatientCode] = useState('');

    const handleAddPatient = async (e) => {
        e.preventDefault();
        // TODO: API-aanroep naar de backend om een patiënt te koppelen met de code.
        // bv. POST /api/provider/link-patient { accessCode: newPatientCode }
        console.log(`Patiënt toevoegen met code: ${newPatientCode}`);
        // Sluit de modal na de poging
        setShowAddPatientModal(false);
        setNewPatientCode('');
    };

    return (
        <div className="patient-management-container">
            <header className="pm-header">
                <h1>Patiëntenbeheer</h1>
                <button onClick={() => setShowAddPatientModal(true)} className="btn btn-primary">
                    + Patiënt Toevoegen
                </button>
            </header>

            <div className="patient-list">
                {patients.map(patient => (
                    <div key={patient.id} className="patient-card">
                        <h3>{patient.name}</h3>
                        <p>Laatste synchronisatie: {patient.lastSync}</p>
                        <button className="btn btn-secondary">Bekijk Dashboard</button>
                    </div>
                ))}
                 {patients.length === 0 && <p>U heeft nog geen patiënten gekoppeld.</p>}
            </div>

            {/* Modal voor het toevoegen van een nieuwe patiënt */}
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
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowAddPatientModal(false)} className="btn btn-secondary">
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
