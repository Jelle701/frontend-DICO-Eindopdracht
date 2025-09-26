import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLinkedPatients, getProviderDashboardSummary, getDelegatedTokenForPatient } from '../../services/ProviderService';
import Navbar from '../../components/Navbar.jsx';
import './ProviderDashboard.css';

const PatientSummaryCard = ({ patient, onViewDashboard }) => {
    const { summaryStats = {}, hasAlerts } = patient;

    const cardClasses = ['patient-summary-card', hasAlerts ? 'has-alerts' : ''].join(' ');

    return (
        <div className={cardClasses}>
            <h3>{patient.firstName} {patient.lastName}</h3>
            <div className="patient-kpis">
                <div className="kpi-item">
                    <span className="kpi-label">Gem. Glucose (7d)</span>
                    <span className="kpi-value">{summaryStats.averageGlucoseLast7Days?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="kpi-item">
                    <span className="kpi-label">Time in Range (7d)</span>
                    <span className="kpi-value">{summaryStats.timeInRangePercentageLast7Days?.toFixed(0) || 'N/A'}%</span>
                </div>
                <div className="kpi-item">
                    <span className="kpi-label">Laatste Sync</span>
                    <span className="kpi-value">{patient.lastSyncTimestamp ? new Date(patient.lastSyncTimestamp).toLocaleDateString('nl-NL') : 'Nooit'}</span>
                </div>
            </div>
            <button onClick={() => onViewDashboard(patient.patientId, `${patient.firstName} ${patient.lastName}`)} className="btn btn-secondary">
                Bekijk Details
            </button>
        </div>
    );
};

function ProviderDashboard() {
    const [patientsSummary, setPatientsSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Stap 1: Haal de lijst van gekoppelde patiënten op
            const { data: patients, error: patientsError } = await getLinkedPatients();
            if (patientsError) throw patientsError;

            if (patients && patients.length > 0) {
                // Stap 2: Maak een array van promises om voor elke patiënt de samenvatting op te halen
                const summaryPromises = patients.map(patient => 
                    getProviderDashboardSummary(patient.id).then(response => {
                        if (response.error) {
                            console.error(`Kon samenvatting voor patiënt ${patient.id} niet ophalen:`, response.error);
                            return null; // Geef null terug bij een fout
                        }
                        // Combineer de basis patiëntdata met de opgehaalde samenvatting
                        return { 
                            ...patient, 
                            patientId: patient.id, // Zorg dat patientId consistent is
                            summaryStats: response.data.summaryStats,
                            hasAlerts: response.data.hasAlerts,
                            lastSyncTimestamp: response.data.lastSyncTimestamp
                        };
                    })
                );

                // Stap 3: Wacht tot alle samenvattingen zijn opgehaald
                const combinedData = await Promise.all(summaryPromises);
                
                // Filter eventuele null-resultaten (vanwege fouten) eruit
                setPatientsSummary(combinedData.filter(Boolean));
            } else {
                setPatientsSummary([]); // Geen patiënten gekoppeld
            }

        } catch (err) {
            setError(err.message || 'Fout bij het ophalen van het dashboard.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleViewDashboard = async (patientId, patientUsername) => {
        try {
            const { data, error: apiError } = await getDelegatedTokenForPatient(patientId);
            if (apiError) throw apiError;

            sessionStorage.setItem('delegatedToken', data.delegatedToken);
            sessionStorage.setItem('patientUsername', patientUsername);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Kon geen toegang krijgen tot het dashboard van de patiënt.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="provider-dashboard-container">
                <header className="provider-header">
                    <h1>Zorgverlener Dashboard</h1>
                    <p>Een overzicht van de recente activiteit van uw patiënten.</p>
                    <Link to="/patient-portal" className="btn btn-primary">
                        Patiënten Beheren
                    </Link>
                </header>

                {loading && <p>Dashboard wordt geladen...</p>}
                {error && <p className="error-message">{error}</p>}

                <div className="patient-summary-grid">
                    {!loading && patientsSummary.length > 0 ? (
                        patientsSummary.map(patient => (
                            <PatientSummaryCard 
                                key={patient.patientId} 
                                patient={patient} 
                                onViewDashboard={handleViewDashboard} 
                            />
                        ))
                    ) : (
                        !loading && <p>Er zijn geen patiënten om een overzicht van te maken.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default ProviderDashboard;
