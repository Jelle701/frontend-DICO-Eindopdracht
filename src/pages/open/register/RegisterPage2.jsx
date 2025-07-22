import React from 'react';
import { useNavigate } from 'react-router-dom';
// CORRECTIE: Importeer de stylesheet direct.
import './RegisterPage.css';

function RegisterPage2() {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        try {
            localStorage.setItem('onboardingRole', role);
            navigate('/onboarding');
        } catch (error) {
            console.error("Kon rol niet opslaan in localStorage", error);
        }
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

export default RegisterPage2;
