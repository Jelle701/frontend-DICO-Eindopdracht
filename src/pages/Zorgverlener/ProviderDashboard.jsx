import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getLinkedPatients, getProviderDashboardSummary } from '../../services/ProviderService';
import Navbar from '../../components/Navbar.jsx';
import './ProviderDashboard.css';

// Helper to calculate age from date of birth
const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Helper to format diabetes type
const formatDiabetesType = (type) => {
    if (!type) return 'N/A';
    return type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1).toLowerCase();
};

function ProviderDashboard() {
    const [patientsSummary, setPatientsSummary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data: patients, error: patientsError } = await getLinkedPatients();
            if (patientsError) throw patientsError;

            if (patients && patients.length > 0) {
                const summaryPromises = patients.map(patient => 
                    getProviderDashboardSummary(patient.id).then(response => {
                        if (response.error) {
                            console.error(`Kon samenvatting voor patiënt ${patient.id} niet ophalen:`, response.error);
                            return null;
                        }
                        return { 
                            ...patient, 
                            patientId: patient.id,
                            summaryStats: response.data.summaryStats, // This might be undefined, but the UI will handle it
                            hasAlerts: response.data.hasAlerts,
                            lastSyncTimestamp: response.data.lastSyncTimestamp
                        };
                    })
                );

                const combinedData = await Promise.all(summaryPromises);
                setPatientsSummary(combinedData.filter(Boolean));
            } else {
                setPatientsSummary([]);
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

    return (
        <>
            <Navbar />
            <div className="provider-dashboard-container page--dark">
                <header className="provider-header">
                    <div className="header-text">
                        <h1>Zorgverlener Dashboard</h1>
                        <p>Een overzicht van de recente activiteit van uw patiënten.</p>
                    </div>
                    <Link to="/patient-portal" className="btn btn--primary">
                        Patiënten Beheren
                    </Link>
                </header>

                {loading && <p>Dashboard wordt geladen...</p>}
                {error && <p className="error-message">{error}</p>}

                <div className="patient-table-container card">
                    {!loading && patientsSummary.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Naam</th>
                                    <th>Leeftijd</th>
                                    <th>Diabetes Type</th>
                                    <th>Gem. Glucose (7d)</th>
                                    <th>Time in Range (7d)</th>
                                    <th>Laatste Sync</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patientsSummary.map(patient => (
                                    <tr key={patient.patientId}>
                                        <td>{patient.firstName} {patient.lastName}</td>
                                        <td className="numeric">{calculateAge(patient.dateOfBirth)}</td>
                                        <td>{formatDiabetesType(patient.diabetesType)}</td>
                                        <td className="numeric">{patient.summaryStats?.averageGlucoseLast7Days?.toFixed(1) || 'N/A'}</td>
                                        <td className="numeric">{patient.summaryStats?.timeInRangePercentageLast7Days?.toFixed(0) || 'N/A'}%</td>
                                        <td>{patient.lastSyncTimestamp ? new Date(patient.lastSyncTimestamp).toLocaleDateString('nl-NL') : 'Nooit'}</td>
                                        <td>
                                            {patient.hasAlerts ? 
                                                <span className="badge badge--recovery-low">Alert</span> : 
                                                <span className="status-ok">OK</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        !loading && <p>Er zijn geen patiënten om een overzicht van te maken.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default ProviderDashboard;
