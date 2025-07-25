// src/pages/open/onboarding/DiabeticDevices.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import diabeticDevicesData from '../../../Data/DiabeticDevices.json';
import './RegisterPage.css';

function DiabeticDevices() {
    const navigate = useNavigate();
    const { submitOnboardingData } = useOnboarding();

    const [formData, setFormData] = useState({
        usesPump: 'nee',
        pump: { manufacturer: '', model: '' },
        usesCGM: 'nee',
        cgm: { manufacturer: '', model: '' },
        usesMeter: 'nee',
        meter: { manufacturer: '', model: '' },
    });
    const [error, setError] = useState('');

    const deviceData = useMemo(() => {
        const getManufacturers = (devices) => [...new Set(devices.map(d => d.Merk))].sort();
        return {
            pumps: {
                data: diabeticDevicesData.Insulinepompen,
                manufacturers: getManufacturers(diabeticDevicesData.Insulinepompen),
            },
            cgms: {
                data: diabeticDevicesData.CGM,
                manufacturers: getManufacturers(diabeticDevicesData.CGM),
            },
            meters: {
                data: diabeticDevicesData.Bloedglucosemeters,
                manufacturers: getManufacturers(diabeticDevicesData.Bloedglucosemeters),
            },
        };
    }, []);

    const handleUsageChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDeviceChange = (e, categoryKey, field) => {
        const { value } = e.target;
        setFormData(prev => {
            const updatedCategory = { ...prev[categoryKey], [field]: value };
            if (field === 'manufacturer') {
                updatedCategory.model = '';
            }
            return { ...prev, [categoryKey]: updatedCategory };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const devicesToSubmit = [];
        if (formData.usesPump === 'ja' && formData.pump.model) {
            devicesToSubmit.push({
                categorie: 'pomp', // FIX: Aangepast naar backend specificatie
                fabrikant: formData.pump.manufacturer,
                model: formData.pump.model,
            });
        }
        if (formData.usesCGM === 'ja' && formData.cgm.model) {
            devicesToSubmit.push({
                categorie: 'cgm', // FIX: Aangepast naar backend specificatie
                fabrikant: formData.cgm.manufacturer,
                model: formData.cgm.model,
            });
        }
        if (formData.usesMeter === 'ja' && formData.meter.model) {
            devicesToSubmit.push({
                categorie: 'meter', // FIX: Aangepast naar backend specificatie
                fabrikant: formData.meter.manufacturer,
                model: formData.meter.model,
            });
        }

        const finalOnboardingData = { diabeticDevices: devicesToSubmit };

        try {
            await submitOnboardingData(finalOnboardingData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Er is iets misgegaan bij het opslaan. Probeer het opnieuw.');
            console.error("Fout bij opslaan onboarding data:", err);
        }
    };

    const renderDeviceSelector = (categoryKey, label, data) => {
        const selectedManufacturer = formData[categoryKey].manufacturer;
        return (
            <div className="device-selector-group">
                <div className="input-group">
                    <label htmlFor={`${categoryKey}-manufacturer`}>Fabrikant {label}</label>
                    <select
                        id={`${categoryKey}-manufacturer`}
                        value={selectedManufacturer}
                        onChange={(e) => handleDeviceChange(e, categoryKey, 'manufacturer')}
                    >
                        <option value="">Kies een fabrikant</option>
                        {data.manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor={`${categoryKey}-model`}>Model {label}</label>
                    <select
                        id={`${categoryKey}-model`}
                        value={formData[categoryKey].model}
                        onChange={(e) => handleDeviceChange(e, categoryKey, 'model')}
                        disabled={!selectedManufacturer}
                    >
                        <option value="">Kies een model</option>
                        {selectedManufacturer && data.data
                            .filter(d => d.Merk === selectedManufacturer)
                            .flatMap(d => d.Modellen)
                            .map(model => <option key={model} value={model}>{model}</option>)}
                    </select>
                </div>
            </div>
        );
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Welke hulpmiddelen gebruik je?</h1>
                <p>Selecteer de apparaten die je gebruikt. Dit helpt ons om data te synchroniseren.</p>

                <div className="input-group">
                    <label>Gebruik je een insulinepomp?</label>
                    <div>
                        <input type="radio" id="usesPumpJa" name="usesPump" value="ja" checked={formData.usesPump === 'ja'} onChange={handleUsageChange} />
                        <label htmlFor="usesPumpJa" style={{ marginRight: '1rem' }}>Ja</label>
                        <input type="radio" id="usesPumpNee" name="usesPump" value="nee" checked={formData.usesPump === 'nee'} onChange={handleUsageChange} />
                        <label htmlFor="usesPumpNee">Nee</label>
                    </div>
                </div>
                {formData.usesPump === 'ja' && renderDeviceSelector('pump', 'Insulinepomp', deviceData.pumps)}

                <div className="input-group">
                    <label>Gebruik je een Continue Glucose Monitor (CGM)?</label>
                    <div>
                        <input type="radio" id="usesCGMJa" name="usesCGM" value="ja" checked={formData.usesCGM === 'ja'} onChange={handleUsageChange} />
                        <label htmlFor="usesCGMJa" style={{ marginRight: '1rem' }}>Ja</label>
                        <input type="radio" id="usesCGMNee" name="usesCGM" value="nee" checked={formData.usesCGM === 'nee'} onChange={handleUsageChange} />
                        <label htmlFor="usesCGMNee">Nee</label>
                    </div>
                </div>
                {formData.usesCGM === 'ja' && renderDeviceSelector('cgm', 'CGM', deviceData.cgms)}

                <div className="input-group">
                    <label>Gebruik je een bloedglucosemeter?</label>
                    <div>
                        <input type="radio" id="usesMeterJa" name="usesMeter" value="ja" checked={formData.usesMeter === 'ja'} onChange={handleUsageChange} />
                        <label htmlFor="usesMeterJa" style={{ marginRight: '1rem' }}>Ja</label>
                        <input type="radio" id="usesMeterNee" name="usesMeter" value="nee" checked={formData.usesMeter === 'nee'} onChange={handleUsageChange} />
                        <label htmlFor="usesMeterNee">Nee</label>
                    </div>
                </div>
                {formData.usesMeter === 'ja' && renderDeviceSelector('meter', 'Bloedglucosemeter', deviceData.meters)}

                {error && <p className="error-message">{error}</p>}
                <button type="submit">Voltooi registratie</button>
            </form>
        </div>
    );
}

export default DiabeticDevices;