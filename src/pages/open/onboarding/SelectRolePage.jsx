/**
 * @file SelectRolePage.jsx
 * @description This is a key step in the onboarding process where the user selects their primary role within the
 * application: Patient, Guardian, or Healthcare Provider. The chosen role determines the subsequent steps in the
 * onboarding flow and the user's overall experience.
 *
 * @component
 * @returns {JSX.Element} The rendered role selection page.
 *
 * @functions
 * - `SelectRolePage()`: The main functional component that manages the state for the selected role, loading, and errors.
 * - `handleRoleSelection(role)`: Updates the `selectedRole` state when a user clicks on one of the role cards.
 * - `handleSubmit()`: An asynchronous function that is triggered when the user proceeds. It validates that a role has
 *   been selected, persists the role to the backend via the `updateUserProfile` service, updates the `OnboardingContext`,
 *   and then navigates the user to the appropriate next page based on their choice.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../../services/ProfileService';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import Navbar from '../../../components/Navbar.jsx';
import './Onboarding.css'; // Gebruik de nieuwe gedeelde CSS

function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { updateOnboardingData } = useOnboarding();

    const handleRoleSelection = (role) => {
        setSelectedRole(role);
    };

    const handleSubmit = async () => {
        if (!selectedRole) {
            setError('Kies een rol om verder te gaan.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Update the user profile role in the backend immediately.
            // This is a good practice to persist the core choice early.
            const { error: apiError } = await updateUserProfile({ role: selectedRole });
            if (apiError) throw apiError;

            // 2. Store the role in the onboarding context for the final submission.
            updateOnboardingData({ role: selectedRole });

            // 3. Navigate to the correct next step based on the role.
            switch (selectedRole) {
                case 'PATIENT':
                    navigate('/onboarding/preferences');
                    break;
                case 'GUARDIAN':
                    navigate('/link-patient');
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
                <div className="role-selection-container">
                    <h1>Kies uw rol</h1>
                    <p>Vertel ons wie u bent om uw ervaring te personaliseren.</p>

                    <div className="role-options">
                        <div
                            className={`role-card ${selectedRole === 'PATIENT' ? 'selected' : ''}`}
                            onClick={() => handleRoleSelection('PATIENT')}
                        >
                            <div className="checkbox-icon"></div>
                            <h3>Patiënt</h3>
                            <p>Ik wil mijn eigen gezondheidsdata bijhouden en beheren.</p>
                        </div>

                        <div
                            className={`role-card ${selectedRole === 'GUARDIAN' ? 'selected' : ''}`}
                            onClick={() => handleRoleSelection('GUARDIAN')}
                        >
                            <div className="checkbox-icon"></div>
                            <h3>Ouder / Voogd</h3>
                            <p>Ik wil de data van een gezinslid (bv. mijn kind) bekijken.</p>
                        </div>

                        <div
                            className={`role-card ${selectedRole === 'PROVIDER' ? 'selected' : ''}`}
                            onClick={() => handleRoleSelection('PROVIDER')}
                        >
                            <div className="checkbox-icon"></div>
                            <h3>Zorgverlener</h3>
                            <p>Ik wil de data van meerdere patiënten beheren.</p>
                        </div>
                    </div>

                    {error && <p className="error-message" style={{ marginTop: 'var(--space-5)' }}>{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selectedRole}
                        className="btn btn--primary form-action-button"
                    >
                        {loading ? 'Bezig met opslaan...' : 'Volgende'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default SelectRolePage;
