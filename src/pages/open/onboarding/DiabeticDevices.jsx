import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import devicesData from '../../../Data/DiabeticDevices.json';
import Navbar from '../../../components/Navbar.jsx';
import './RegisterPage.css';

function DiabeticDevices() {
    const { submitOnboardingData } = useOnboarding();
    const navigate = useNavigate();

    const [selections, setSelections] = useState({
        cgm: { brand: '', model: '' },
        insulinPump: { brand: '', model: '' },
        bloodGlucoseMeter: { brand: '', model: '' },
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (category, field, value) => {
        setSelections(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value,
                ...(field === 'brand' && { model: '' })
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const selectedDevices = Object.entries(selections)
            .map(([key, value]) => ({ ...value, category: key }))
            .filter(device => device.brand && device.model);

        try {
            // DE FIX: Roep alleen de submit functie aan.
            // De PrivateRoute zal de navigatie afhandelen nadat de user state is bijgewerkt.
            await submitOnboardingData(selectedDevices);
            
            // De 'navigate' call is hier verwijderd om de race condition op te lossen.
            // De pagina blijft hier nu wachten tot de PrivateRoute de gebruiker doorstuurt.

        } catch (err) {
            setError(err.message || 'Er is een onbekende fout opgetreden.');
            setLoading(false); // Zorg ervoor dat de loading state stopt bij een fout
        }
        // setLoading(false) wordt hier niet meer gezet, omdat de pagina zal navigeren.
    };

    const renderDeviceSelector = (categoryKey, categoryName) => {
        const categoryData = devicesData[categoryName] || [];
        const currentSelection = selections[categoryKey] || { brand: '', model: '' };
        const models = currentSelection.brand
            ? categoryData.find(b => b.Merk === currentSelection.brand)?.Modellen || []
            : [];

        return (
            <div className="device-category-box">
                <h2>{categoryName}</h2>
                <div className="input-group">
                    <label htmlFor={`${categoryKey}-brand`}>Merk</label>
                    <select
                        id={`${categoryKey}-brand`}
                        value={currentSelection.brand}
                        onChange={(e) => handleChange(categoryKey, 'brand', e.target.value)}
                    >
                        <option value="">Kies een merk</option>
                        {categoryData.map(b => <option key={b.Merk} value={b.Merk}>{b.Merk}</option>)}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor={`${categoryKey}-model`}>Model</label>
                    <select
                        id={`${categoryKey}-model`}
                        value={currentSelection.model}
                        onChange={(e) => handleChange(categoryKey, 'model', e.target.value)}
                        disabled={!currentSelection.brand}
                    >
                        <option value="">Kies een model</option>
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="onboarding-page-container">
                <div className="auth-page">
                    <form onSubmit={handleSubmit}>
                        <h1>Hulpmiddelen</h1>
                        <p>Selecteer de hulpmiddelen die u gebruikt. Dit is niet verplicht.</p>

                        {renderDeviceSelector('cgm', 'CGM')}
                        {renderDeviceSelector('insulinPump', 'Insulinepompen')}
                        {renderDeviceSelector('bloodGlucoseMeter', 'Bloedglucosemeters')}

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" disabled={loading} className="btn btn--primary form-action-button">
                            {loading ? 'Bezig met opslaan...' : 'Voltooien'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default DiabeticDevices;
