// src/pages/Authorization/MyDataPage.jsx
import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../services/ProfileService';
import Navbar from '../../components/Navbar';
import './MyDataPage.css';

// Helper om de enums van de backend te mappen naar leesbare labels
const GENDER_MAP = {
    MALE: 'Man',
    FEMALE: 'Vrouw',
    OTHER: 'Anders',
    PREFER_NOT_TO_SAY: 'Zeg ik liever niet',
};

const DIABETES_TYPE_MAP = {
    TYPE_1: 'Type 1',
    TYPE_2: 'Type 2',
    LADA: 'LADA',
    MODY: 'MODY',
    GESTATIONAL: 'Zwangerschapsdiabetes',
    OTHER: 'Anders/Onbekend',
};

function MyDataPage() {
    const { user, setUserData } = useUser();
    const { loading: authLoading } = useAuth();

    const [formState, setFormState] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormState(user);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        const { data, error: updateError } = await updateUserProfile(formState);

        if (updateError) {
            setError(updateError.message);
        } else {
            setSuccess('Gegevens succesvol bijgewerkt!');
            setUserData(data); // Update de globale user state
            setTimeout(() => setSuccess(''), 3000);
        }
        setIsSubmitting(false);
    };

    if (authLoading || !formState) {
        return (
            <>
                <Navbar />
                <div className="my-data-page"><p>Gegevens worden geladen...</p></div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="my-data-page">
                <form className="form-card" onSubmit={handleSubmit}>
                    <h1>Mijn Gegevens</h1>

                    {/* --- Persoonlijke Gegevens --- */}
                    <div className="form-section">
                        <h2>Persoonlijke Gegevens</h2>
                        <div className="input-group">
                            <label>Voornaam</label>
                            <input type="text" name="firstName" value={formState.firstName || ''} onChange={handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label>Achternaam</label>
                            <input type="text" name="lastName" value={formState.lastName || ''} onChange={handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label>Geboortedatum</label>
                            <input type="date" name="dateOfBirth" value={formState.dateOfBirth ? formState.dateOfBirth.split('T')[0] : ''} onChange={handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label>Geslacht</label>
                            <select name="gender" value={formState.gender || ''} onChange={handleInputChange}>
                                {Object.entries(GENDER_MAP).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* --- Medische Informatie --- */}
                    <div className="form-section">
                        <h2>Medische Informatie</h2>
                        <div className="input-group">
                            <label>Type Diabetes</label>
                            <select name="diabetesType" value={formState.diabetesType || ''} onChange={handleInputChange}>
                                {Object.entries(DIABETES_TYPE_MAP).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Langwerkende Insuline</label>
                            <input type="text" name="longActingInsulin" value={formState.longActingInsulin || ''} onChange={handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label>Kortwerkende Insuline</label>
                            <input type="text" name="shortActingInsulin" value={formState.shortActingInsulin || ''} onChange={handleInputChange} />
                        </div>
                    </div>

                    {/* --- Hulpmiddelen (Alleen-lezen) --- */}
                    <div className="form-section read-only-section">
                        <h2>Hulpmiddelen</h2>
                        {formState.diabeticDevices && formState.diabeticDevices.length > 0 ? (
                            <ul>
                                {formState.diabeticDevices.map((device, index) => (
                                    <li key={index}>{device.category}: {device.brand} {device.model}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Geen hulpmiddelen geregistreerd.</p>
                        )}
                    </div>

                    {/* --- Account Status (Alleen-lezen) --- */}
                    <div className="form-section read-only-section">
                        <h2>Account Status</h2>
                        <p><strong>Rol:</strong> {formState.role}</p>
                        <p><strong>E-mail Geverifieerd:</strong> {formState.flags?.emailVerified ? 'Ja' : 'Nee'}</p>
                        <p><strong>Onboarding Voltooid:</strong> {formState.flags?.hasDetails ? 'Ja' : 'Nee'}</p>
                    </div>

                    {success && <p className="form-message success">{success}</p>}
                    {error && <p className="form-message error">{error}</p>}

                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Bezig met opslaan...' : 'Gegevens Opslaan'}
                    </button>
                </form>
            </div>
        </>
    );
}

export default MyDataPage;
