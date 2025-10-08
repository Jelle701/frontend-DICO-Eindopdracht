import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/ApiClient';
import { getDiabetesSummaryForGuardian } from '../../services/DiabetesService.jsx'; // Import new service
import Navbar from '../../components/web components/Navbar.jsx';
import DiabeticRapportValues from '../../components/DiabeticRapportValues.jsx'; // Import summary component
import '../../components/DiabeticRapportValues.css'; // Import summary styles
import './GuardianPatientDetail.css';

// --- API Functions ---
const getLinkedPatientsForGuardian = async () => {
    try {
        const response = await apiClient.get('/guardian/linked-patients');
        return { data: response.data, error: null };
    } catch (error) {
        console.error('[GuardianPatientDetail] Fout bij ophalen gekoppelde patiënten:', error);
        return { data: null, error };
    }
};

const getGlucoseMeasurementsForPatient = async (patientId) => {
    try {
        const response = await apiClient.get(`/guardian/linked-patients/${patientId}/glucose-measurements`);
        return { data: response.data, error: null };
    } catch (error) {
        console.error(`[GuardianPatientDetail] Fout bij ophalen glucosemetingen voor patiënt ${patientId}:`, error);
        return { data: null, error };
    }
};

// --- Helper Functions ---
const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
};

const getGlucoseValueClass = (value) => {
    if (value > 10.0) return 'glucose-value--high';
    if (value < 4.0) return 'glucose-value--low';
    return '';
};

// --- Child Components ---

const ProfileSummaryCard = ({ patient }) => (
    <div className="profile-summary-card card">
        <h3>Profiel</h3>
        <div className="detail-item"><span>Naam</span><strong>{patient.firstName} {patient.lastName}</strong></div>
        <div className="detail-item"><span>Leeftijd</span><strong>{calculateAge(patient.dateOfBirth)} jaar</strong></div>
        <div className="detail-item"><span>Geboortedatum</span><strong>{new Date(patient.dateOfBirth).toLocaleDateString('nl-NL')}</strong></div>
        <div className="detail-item"><span>Email</span><strong>{patient.username}</strong></div>
        <div className="detail-item"><span>Diabetes Type</span><strong>{patient.diabetesType || 'N/A'}</strong></div>
    </div>
);

const MeasurementsCard = ({ measurements }) => {
    const safeMeasurements = Array.isArray(measurements) ? measurements : [];

    return (
        <div className="measurements-card card">
            <h3>Recente Glucosemetingen</h3>
            {safeMeasurements.length > 0 ? (
                <div className="table-wrapper-guardian">
                    <table className="measurements-table">
                        <thead>
                            <tr>
                                <th>Datum</th>
                                <th>Tijd</th>
                                <th>Waarde (mmol/L)</th>
                                <th>Commentaar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {safeMeasurements.map(m => (
                                <tr key={m.id}>
                                    <td>{new Date(m.timestamp).toLocaleDateString('nl-NL')}</td>
                                    <td>{new Date(m.timestamp).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>
                                        <span className={getGlucoseValueClass(m.value)}>{m.value.toFixed(1)}</span>
                                    </td>
                                    <td>{m.comment || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="empty-state">Geen metingen gevonden voor deze patiënt.</p>
            )}
        </div>
    );
};

// --- Main Component ---

function GuardianPatientDetail() {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [measurements, setMeasurements] = useState([]);
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(true);
    const [summaryError, setSummaryError] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setSummaryLoading(true);
        setError('');
        setSummaryError('');

        try {
            // Fetch patient details and measurements
            const { data: patients, error: patientsError } = await getLinkedPatientsForGuardian();
            if (patientsError) throw patientsError;
            const currentPatient = patients.find(p => p.id.toString() === patientId);
            if (!currentPatient) throw new Error('Patiënt niet gevonden of niet gekoppeld.');
            setPatient(currentPatient);

            const { data: measurementsData, error: measurementsError } = await getGlucoseMeasurementsForPatient(patientId);
            if (measurementsError) throw measurementsError;
            if (Array.isArray(measurementsData)) {
                setMeasurements(measurementsData);
            } else {
                console.warn('[GuardianPatientDetail] API did not return an array for glucose measurements.');
                setMeasurements([]);
            }

            // Fetch diabetes summary
            const summary = await getDiabetesSummaryForGuardian(patientId);
            setSummaryData(summary);

        } catch (err) {
            setError(err.message || 'Fout bij het ophalen van patiëntgegevens.');
        } finally {
            setLoading(false);
            setSummaryLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <Navbar />
            <div className="patient-detail-container page--dark">
                {loading ? (
                    <p className="loading-message">Gegevens worden geladen...</p>
                ) : error ? (
                    <p className="error-message-full-page">{error}</p>
                ) : patient && (
                    <>
                        <header className="detail-page-header">
                            <Link to="/guardian-portal" className="back-link">&larr; Terug naar overzicht</Link>
                            <div className="header-content">
                                <h1>Details voor {patient.firstName} {patient.lastName}</h1>
                                <button onClick={fetchData} className="btn btn--secondary">
                                    Ververs Gegevens
                                </button>
                            </div>
                        </header>
                        <div className="patient-details-grid">
                            <ProfileSummaryCard patient={patient} />
                            <MeasurementsCard measurements={measurements} />
                            <div className="summary-container-guardian">
                                {summaryLoading ? (
                                    <p>Samenvatting laden...</p>
                                ) : summaryError ? (
                                    <p className="error-message">{summaryError}</p>
                                ) : summaryData ? (
                                    <DiabeticRapportValues data={summaryData} title="Diabetes Samenvatting" density="compact" />
                                ) : (
                                    <p>Geen samenvattingsgegevens beschikbaar.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default GuardianPatientDetail;
