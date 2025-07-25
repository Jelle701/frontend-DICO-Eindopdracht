// src/pages/open/onboarding/RegisterDetailsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext.jsx';
import './RegisterPage.css';

function RegisterDetailsPage() {
    const navigate = useNavigate();
    const { updateOnboardingData } = useOnboarding();

    const handleRoleSelect = (role) => {
        // FIX: Deze regel was uitgecommentarieerd.
        // We slaan nu de rol op in de OnboardingContext.
        // De backend verwacht waarschijnlijk een 'preferences' object.
        updateOnboardingData({
            preferences: {
                role: role // Je kunt hier meer voorkeuren toevoegen
            }
        });
        navigate('/onboarding'); // Ga naar de volgende stap
    };

    return (
        <div className="auth-page">
            <div className="form-content">
                <h1>Wat is jouw rol?</h1>
                <p>Kies de rol die het beste bij je past. Dit helpt ons de ervaring op jou af te stemmen.</p>
                <div className="role-selection">
                    <button onClick={() => handleRoleSelect('Patient')} className="role-button">Ik ben een Patiënt</button>
                    <button onClick={() => handleRoleSelect('Zorgverlener')} className="role-button">Ik ben een Zorgverlener</button>
                    <button onClick={() => handleRoleSelect('Ouder/Verzorger')} className="role-button">Ik ben een Ouder/Verzorger</button>
                    <button onClick={() => handleRoleSelect('Onderzoeker')} className="role-button">Ik ben een Onderzoeker</button>
                </div>
            </div>
        </div>
    );
}

export default RegisterDetailsPage;