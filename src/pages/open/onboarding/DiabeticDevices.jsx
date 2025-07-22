import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOnboardingData } from 'src/services/api.jsx';
import diabeticDevices from 'src/Data/DiabeticDevices.json';
import './RegisterPage.css'; // <-- CORRECTED PATH

function DiabeticDevices() {
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDeviceToggle = (deviceName) => {
        setSelectedDevices(prev =>
            prev.includes(deviceName)
                ? prev.filter(item => item !== deviceName)
                : [...prev, deviceName]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Verzamel alle onboarding data uit localStorage
            const onboardingData = {
                role: localStorage.getItem('onboardingRole'),
                preferences: JSON.parse(localStorage.getItem('onboardingPreferences')),
                medicineInfo: JSON.parse(localStorage.getItem('onboardingMedicine')),
                devices: selectedDevices,
            };

            // Stuur de data naar de backend
            // await saveOnboardingData(onboardingData); // Tijdelijk uitgecommentarieerd voor testen

            // Ruim localStorage op na succesvolle submit
            localStorage.removeItem('onboardingRole');
            localStorage.removeItem('onboardingPreferences');
            localStorage.removeItem('onboardingMedicine');

            // Navigeer naar het dashboard
            navigate('/dashboard');

        } catch (err) {
            setError('Er is iets misgegaan bij het opslaan van je gegevens. Probeer het opnieuw.');
            console.error("Fout bij opslaan onboarding data:", err);
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Welke hulpmiddelen gebruik je?</h1>
                <p>Selecteer de apparaten die je gebruikt. Dit helpt ons om data te synchroniseren.</p>
                <div className="device-selection">
                    {diabeticDevices.map(device => (
                        <button
                            type="button"
                            key={device.id}
                            className={selectedDevices.includes(device.name) ? 'selected' : ''}
                            onClick={() => handleDeviceToggle(device.name)}
                        >
                            {device.name}
                        </button>
                    ))}
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Voltooi registratie</button>
            </form>
        </div>
    );
}

export default DiabeticDevices;