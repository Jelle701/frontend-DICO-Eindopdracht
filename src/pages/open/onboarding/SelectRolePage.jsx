import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../../services/ProfileService';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import Navbar from '../../../components/Navbar.jsx'; // Importeer de Navbar
import './RegisterPage.css';

function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { updateOnboardingData } = useOnboarding();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRole) {
            setError('Kies een rol om verder te gaan.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await updateUserProfile({ role: selectedRole });
            updateOnboardingData({ role: selectedRole });

            switch (selectedRole) {
                case 'PATIENT':
                    navigate('/onboarding/preferences');
                    break;
                case 'GUARDIAN':
                    navigate('/onboarding/link-patient');
                    break;
                case 'PROVIDER':
                    navigate('/patient-management');
                    break;
                default:
                    setError('Ongeldige rol geselecteerd.');
                    break;
            }
        } catch (apiError) {
            setError(apiError.message || 'Er is een fout opgetreden bij het opslaan van uw rol.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="onboarding-page-container">
                <div className="auth-page">
                    <form onSubmit={handleSubmit}>
                        <h1>Kies uw rol</h1>
                        <p>Vertel ons wie u bent om uw ervaring te personaliseren.</p>

                        <div className="input-group">
                            <label htmlFor="role-select">Uw rol</label>
                            <select 
                                id="role-select"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Maak een keuze --</option>
                                <option value="PATIENT">Patiënt</option>
                                <option value="GUARDIAN">Ouder / Voogd</option>
                                <option value="PROVIDER">Zorgverlener</option>
                            </select>
                        </div>

                        <div className="role-description" style={{textAlign: 'center', minHeight: '60px', marginTop: 'var(--space-3)'}}>
                            {selectedRole === 'PATIENT' && <p>Ik wil mijn eigen gezondheidsdata bijhouden en beheren.</p>}
                            {selectedRole === 'GUARDIAN' && <p>Ik wil de data van een gezinslid (bv. mijn kind) bekijken.</p>}
                            {selectedRole === 'PROVIDER' && <p>Ik wil de data van meerdere patiënten beheren.</p>}
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" disabled={loading || !selectedRole} className="btn btn--primary form-action-button">
                            {loading ? 'Bezig met opslaan...' : 'Volgende'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SelectRolePage;
