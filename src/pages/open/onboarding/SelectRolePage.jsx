import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../../services/ProfileService'; // Importeer de profielservice
import './RegisterPage.css'; // We hergebruiken de styling

function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!selectedRole) {
            setError('Kies een rol om verder te gaan.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // OPGELOST: Roep de backend aan om de rol van de gebruiker op te slaan.
            const { error: apiError } = await updateUserProfile({ role: selectedRole });

            if (apiError) {
                // Als er een fout is bij het opslaan van de rol, gooi deze dan.
                throw apiError;
            }

            // Navigeer naar de juiste flow op basis van de gekozen rol.
            switch (selectedRole) {
                case 'PATIENT':
                    navigate('/onboarding'); 
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
            <div className="role-selection-container" style={{ maxWidth: '500px', margin: 'auto' }}>
                <h1>Kies uw rol</h1>
                <p>Stap 2: Selecteer hoe u deze applicatie wilt gebruiken.</p>
                
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
                        <option value="GUARDIAN">Ouder/Voogd</option>
                        <option value="PROVIDER">Zorgverlener</option>
                    </select>
                </div>

                <div className="role-description">
                    {selectedRole === 'PATIENT' && <p>U kunt uw eigen gezondheidsdata bijhouden en beheren.</p>}
                    {selectedRole === 'GUARDIAN' && <p>U kunt de data van één gezinslid (bv. uw kind) bekijken na het invoeren van een koppelcode.</p>}
                    {selectedRole === 'PROVIDER' && <p>U kunt de data van meerdere patiënten beheren die u toegang hebben verleend.</p>}
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
