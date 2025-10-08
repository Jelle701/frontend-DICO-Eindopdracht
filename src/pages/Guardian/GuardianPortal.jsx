import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/ApiClient';
import Navbar from '../../components/web components/Navbar.jsx';
import './GuardianPortal.css';

// --- API Functions (integrated to avoid import issues) ---
const getLinkedPatientsForGuardian = async () => {
    try {
        const response = await apiClient.get('/guardian/linked-patients');
        return { data: response.data, error: null };
    } catch (error) {
        console.error('[GuardianPortal] Fout bij ophalen gekoppelde patiënten:', error);
        return { data: null, error };
    }
};

const linkPatientToGuardian = async (accessCode) => {
    try {
        const response = await apiClient.post('/guardian/link-patient', { accessCode });
        return { data: response.data, error: null };
    } catch (error) {
        console.error('[GuardianPortal] Fout bij koppelen patiënt:', error);
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

// --- Child Components ---

const LinkPatientView = ({ onSubmit, accessCode, setAccessCode, error, loading }) => (
    <div className="link-patient-view">
        <div className="auth-form-card">
            <h2>Koppel aan uw kind</h2>
            <p className="auth-form-description">Voer de unieke toegangscode in die u van uw kind of zorgverlener heeft ontvangen om de gegevens in te zien.</p>
            <form onSubmit={onSubmit} className="link-patient-form">
                <div className="input-group">
                    <label htmlFor="accessCode">Toegangscode</label>
                    <input
                        id="accessCode"
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        placeholder="bv. 123456"
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading} className="btn btn--primary form-action-button">
                    {loading ? 'Bezig met koppelen...' : 'Koppel'}
                </button>
            </form>
        </div>
    </div>
);

const PatientDataView = ({ patients }) => {
    const navigate = useNavigate();
    const handlePatientClick = (patientId) => {
        navigate(`/guardian/patient/${patientId}`);
    };

    return (
        <div className="patient-data-view">
            <div className="patient-grid">
                {patients.map(patient => (
                    <div key={patient.id} className="patient-card card" onClick={() => handlePatientClick(patient.id)}>
                        <div className="card-header">
                            <div className="patient-name">{patient.firstName} {patient.lastName}</div>
                            <div className="patient-age">{calculateAge(patient.dateOfBirth)} jaar</div>
                        </div>
                        <div className="card-body">
                            <div className="stat-item">
                                <span className="stat-label">Geboortedatum</span>
                                <span className="stat-value">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('nl-NL') : 'N/A'}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Diabetes Type</span>
                                <span className="stat-value">{patient.diabetesType || 'N/A'}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Lengte</span>
                                <span className="stat-value">{patient.height ? `${patient.height} cm` : 'N/A'}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Gewicht</span>
                                <span className="stat-value">{patient.weight ? `${patient.weight} kg` : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main Component ---

function GuardianPortal() {
    const [linkedPatients, setLinkedPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchLinkedPatients = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data, error: apiError } = await getLinkedPatientsForGuardian();
            if (apiError) throw apiError;
            setLinkedPatients(data || []);
        } catch (err) {
            setError(err.message || 'Fout bij het ophalen van uw gegevens.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLinkedPatients();
    }, [fetchLinkedPatients]);

    const handleLinkSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError('');
        try {
            const { error: apiError } = await linkPatientToGuardian(accessCode);
            if (apiError) throw apiError;
            await fetchLinkedPatients(); // On success, this will refresh and show the patient view
        } catch (err) {
            setFormError(err.response?.data?.message || 'De code is ongeldig of al gebruikt.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return <p className="loading-message">Gegevens worden geladen...</p>;
        }
        if (error) {
            return <p className="error-message-full-page">{error}</p>;
        }
        if (linkedPatients.length > 0) {
            return <PatientDataView patients={linkedPatients} />;
        }
        // If no patients are linked, directly show the form to link one.
        return (
            <LinkPatientView
                onSubmit={handleLinkSubmit}
                accessCode={accessCode}
                setAccessCode={setAccessCode}
                error={formError}
                loading={isSubmitting}
            />
        );
    };

    return (
        <>
            <Navbar />
            <div className="guardian-portal-container page--dark">
                <header className="portal-header">
                    <h1>Ouderportaal</h1>
                    <p>
                        {linkedPatients.length > 0
                            ? 'Een overzicht van de gegevens van uw gekoppelde kind(eren).'
                            : 'Koppel een kind om de gegevens in te zien.'}
                    </p>
                </header>
                {renderContent()}
            </div>
        </>
    );
}

export default GuardianPortal;
