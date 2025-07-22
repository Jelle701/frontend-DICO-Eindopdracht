import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingData } from '../../../services/api'; // Zorg dat dit pad klopt
// CORRECTIE: Importeer de stylesheet direct.
import './RegisterPage.css';

function DiabeticDevices() {
    const navigate = useNavigate();
    const [devices, setDevices] = useState({
        cgm: { used: false, brand: '', model: '' },
        pomp: { used: false, brand: '', model: '' },
        meter: { used: false, brand: '', model: '' },
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setDevices(prev => ({
            ...prev,
            [name]: { ...prev[name], used: checked }
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [device, field] = name.split('-');
        setDevices(prev => ({
            ...prev,
            [device]: { ...prev[device], [field]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const role = localStorage.getItem('onboardingRole');
            const preferences = JSON.parse(localStorage.getItem('onboardingPreferences'));
            const medicine = JSON.parse(localStorage.getItem('onboardingMedicine'));

            const fullOnboardingPayload = {
                role,
                ...preferences,
                ...medicine,
                devices
            };

            await saveOnboardingData(fullOnboardingPayload);

            localStorage.removeItem('onboardingRole');
            localStorage.removeItem('onboardingPreferences');
            localStorage.removeItem('onboardingMedicine');

            navigate('/dashboard');
        } catch (err) {
            setError('Er is iets misgegaan bij het opslaan van je gegevens.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Hulpmiddelen</h1>
                <p>Geef aan welke hulpmiddelen je gebruikt.</p>

                <div className="device-section">
                    <input type="checkbox" id="cgm" name="cgm" checked={devices.cgm.used} onChange={handleCheckboxChange} />
                    <label htmlFor="cgm">Continue Glucose Monitor (CGM)</label>
                    {devices.cgm.used && (
                        <div className="device-inputs">
                            <input type="text" name="cgm-brand" placeholder="Merk" onChange={handleInputChange} />
                            <input type="text" name="cgm-model" placeholder="Model" onChange={handleInputChange} />
                        </div>
                    )}
                </div>

                <div className="device-section">
                    <input type="checkbox" id="pomp" name="pomp" checked={devices.pomp.used} onChange={handleCheckboxChange} />
                    <label htmlFor="pomp">Insulinepomp</label>
                    {devices.pomp.used && (
                        <div className="device-inputs">
                            <input type="text" name="pomp-brand" placeholder="Merk" onChange={handleInputChange} />
                            <input type="text" name="pomp-model" placeholder="Model" onChange={handleInputChange} />
                        </div>
                    )}
                </div>

                <div className="device-section">
                    <input type="checkbox" id="meter" name="meter" checked={devices.meter.used} onChange={handleCheckboxChange} />
                    <label htmlFor="meter">Bloedglucosemeter</label>
                    {devices.meter.used && (
                        <div className="device-inputs">
                            <input type="text" name="meter-brand" placeholder="Merk" onChange={handleInputChange} />
                            <input type="text" name="meter-model" placeholder="Model" onChange={handleInputChange} />
                        </div>
                    )}
                </div>

                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Bezig met opslaan...' : 'Voltooien en naar dashboard'}
                </button>
            </form>
        </div>
    );
}

export default DiabeticDevices;
