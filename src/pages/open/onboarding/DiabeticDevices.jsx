/**
 * @file DiabeticDevices.jsx
 * @description This is the final step of the user onboarding process. It allows the user to optionally select the
 * diabetic devices they use, such as Continuous Glucose Monitors (CGMs), insulin pumps, and blood glucose meters,
 * from a predefined list loaded from a local JSON file.
 *
 * @component
 * @returns {JSX.Element} The rendered diabetic device selection form.
 *
 * @functions
 * - `DiabeticDevices()`: The main functional component that manages the state for the device selections.
 * - `handleChange(category, field, value)`: Updates the state for a specific device category (e.g., `cgm`). When a
 *   brand is selected, it resets the model selection to ensure data consistency.
 * - `handleSubmit(e)`: The final submission function for the onboarding process. It gathers all selected device data,
 *   updates the `OnboardingContext`, and then calls the `submitOnboardingData` function to send the complete onboarding
 *   dataset to the backend. On success, it navigates the user to their new dashboard.
 * - `renderDeviceSelector(categoryKey, categoryName)`: A reusable function that renders the brand and model dropdowns
 *   for a given device category, reducing code duplication and improving maintainability.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import devicesData from '../../../Data/DiabeticDevices.json';
import Navbar from '../../../components/Navbar.jsx';
import './Onboarding.css'; // Gebruik de nieuwe gedeelde CSS

function DiabeticDevices() {
    const { onboardingData, updateOnboardingData, submitOnboardingData } = useOnboarding();
    const navigate = useNavigate();

    const initialState = {
        cgm: { brand: '', model: '' },
        insulinPump: { brand: '', model: '' },
        bloodGlucoseMeter: { brand: '', model: '' },
        ...onboardingData.diabeticDevices,
    };

    const [selections, setSelections] = useState(initialState);
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
            updateOnboardingData({ diabeticDevices: selectedDevices });
            const finalData = { ...onboardingData, diabeticDevices: selectedDevices };
            await submitOnboardingData(finalData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Er is een onbekende fout opgetreden.');
        } finally {
            setLoading(false);
        }
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
                <div className="diabetic-devices-container">
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
