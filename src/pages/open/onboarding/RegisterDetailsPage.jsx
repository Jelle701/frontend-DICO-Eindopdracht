import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { updateUserRole } from '../../../services/ProfileService'; // Deze service moeten we later aanmaken/aanpassen
import './RegisterPage.css'; // We hergebruiken de styling

// Dit was RegisterDetailsPage, nu is het de Rol-Selectie Pagina.
function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            // TODO: API-aanroep om de rol van de gebruiker op te slaan in de backend.
            // await updateUserRole({ role: selectedRole });

            // Navigeer naar de juiste flow op basis van de gekozen rol.
            switch (selectedRole) {
                case 'PATIENT':
                    // De onboarding voor de patient is nog niet geimplementeerd.
                    // We sturen ze voor nu naar een placeholder of het dashboard.
                    navigate('/dashboard'); // TIJDELIJK: Moet naar de *echte* volgende stap.
                    break;
                case 'GUARDIAN':
                    navigate('/link-patient'); // Deze pagina moeten we nog aanmaken.
                    break;
                case 'PROVIDER':
                    navigate('/patient-management'); // Deze pagina moeten we nog aanmaken.
                    break;
                default:
                    setError('Ongeldige rol geselecteerd.');
            }
        } catch (apiError) {
            setError(apiError.message || 'Er is een fout opgetreden bij het opslaan van uw rol.');
            console.error('Role selection error:', apiError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="role-selection-container">
                <h1>Kies uw rol</h1>
                <p>Stap 2: Selecteer hoe u deze applicatie wilt gebruiken.</p>
                
                <div className="role-options">
                    <div 
                        className={`role-card ${selectedRole === 'PATIENT' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelection('PATIENT')}
                    >
                        <h3>Patiënt</h3>
                        <p>Ik wil mijn eigen gezondheidsdata bijhouden en beheren.</p>
                    </div>
                    <div 
                        className={`role-card ${selectedRole === 'GUARDIAN' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelection('GUARDIAN')}
                    >
                        <h3>Ouder/Voogd</h3>
                        <p>Ik wil de data van een gezinslid (bv. mijn kind) bekijken.</p>
                    </div>
                    <div 
                        className={`role-card ${selectedRole === 'PROVIDER' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelection('PROVIDER')}
                    >
                        <h3>Zorgverlener</h3>
                        <p>Ik wil de data van meerdere patiënten beheren.</p>
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button onClick={handleSubmit} disabled={loading || !selectedRole} className="btn-submit-role">
                    {loading ? 'Bezig met opslaan...' : 'Volgende'}
                </button>
            </div>
        </div>
    );
}

export default SelectRolePage;
