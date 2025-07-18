// src/pages/open/register/DiabeticDevices.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import deviceData from '../../../Data/DiabeticDevices.json';
import { saveOnboardingData } from 'src/services/api.jsx';
import Navbar from '../../../components/Navbar.jsx';
import './RegisterPage.css';

function DiabeticDevices() {
    const navigate = useNavigate();
    const allDeviceTypes = ['Bloedglucosemeters', 'CGM', 'Insulinepompen'];
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedManufacturers, setSelectedManufacturers] = useState({});
    const [selectedModels, setSelectedModels] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleToggleType = (type) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
            // ... (rest of the logic is correct)
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    const handleManufacturerChange = (type, manufacturer) => {
        setSelectedManufacturers({ ...selectedManufacturers, [type]: manufacturer });
        setSelectedModels({ ...selectedModels, [type]: '' });
    };

    const handleModelChange = (type, model) => {
        setSelectedModels({ ...selectedModels, [type]: model });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const diabeticDevices = selectedTypes.map((type) => ({
                categorie: type,
                fabrikant: selectedManufacturers[type] || '',
                model: selectedModels[type] || '',
            }));

            const role = JSON.parse(localStorage.getItem('onboardingRole'));
            const preferences = JSON.parse(localStorage.getItem('userPreferences'));
            const medicineInfo = JSON.parse(localStorage.getItem('medicineInfo'));

            const fullOnboardingPayload = { role, preferences, medicineInfo, diabeticDevices };
            await saveOnboardingData(fullOnboardingPayload);

            localStorage.removeItem('onboardingRole');
            localStorage.removeItem('userPreferences');
            localStorage.removeItem('medicineInfo');

            navigate('/dashboard');
        } catch (err) {
            setError('Er is iets misgegaan bij het opslaan van uw gegevens. Probeer het opnieuw.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page container">
                <h1>Diabeteshulpmiddelen</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <p>Welke hulpmiddelen gebruik je?</p>
                    {allDeviceTypes.map((type) => (
                        <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => handleToggleType(type)} />
                            {type}
                        </label>
                    ))}
                    {selectedTypes.map((type) => {
                        const fabrikanten = deviceData[type]?.map(d => d.Merk) || [];
                        const selectedFabrikant = selectedManufacturers[type];
                        const modellen = deviceData[type]?.find(d => d.Merk === selectedFabrikant)?.Modellen || [];
                        return (
                            <div key={type} className="device-selection" style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                                <h4>{type}</h4>
                                <label>Fabrikant:</label>
                                <select value={selectedFabrikant || ''} onChange={(e) => handleManufacturerChange(type, e.target.value)} required>
                                    <option value="">Selecteer fabrikant</option>
                                    {fabrikanten.map(fab => (<option key={fab} value={fab}>{fab}</option>))}
                                </select>
                                {selectedFabrikant && (
                                    <>
                                        <label style={{ marginTop: '0.5rem' }}>Model:</label>
                                        <select value={selectedModels[type] || ''} onChange={(e) => handleModelChange(type, e.target.value)} required>
                                            <option value="">Selecteer model</option>
                                            {modellen.map(mod => (<option key={mod} value={mod}>{mod}</option>))}
                                        </select>
                                    </>
                                )}
                            </div>
                        );
                    })}
                    {error && <p className="error-text" style={{ color: '#ff8888', marginTop: '1rem' }}>{error}</p>}
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '2rem' }}>
                        {loading ? 'Bezig met opslaan...' : 'Afronden'}
                    </button>
                </form>
            </div>
        </>
    );
}

export default DiabeticDevices;