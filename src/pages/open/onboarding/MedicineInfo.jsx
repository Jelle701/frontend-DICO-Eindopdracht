/**
 * @file MedicineInfo.jsx
 * @description This is a step in the user onboarding process where the user provides their medical information.
 * It captures the user's diabetes type and details about their insulin usage, including the specific types of
 * long-acting and short-acting insulin they use, selected from a predefined list.
 *
 * @component
 * @returns {JSX.Element} The rendered medical information form.
 *
 * @functions
 * - `MedicineInfo()`: The main functional component that manages the form's state and logic.
 * - `useMemo` hook: Memoizes the list of insulin manufacturers derived from the local JSON data to prevent
 *   unnecessary recalculations on re-renders.
 * - `handleChange(e, insulinCategory, field)`: Handles state updates for the nested insulin objects (longActing and
 *   shortActing). It resets the selected insulin when the manufacturer is changed.
 * - `handleTopLevelChange(e)`: Handles state updates for top-level form fields like diabetes type and the
 *   radio button for insulin usage.
 * - `handleSubmit(e)`: Validates the form, updates the central `OnboardingContext` with the collected medical
 *   information, and navigates the user to the next step in the onboarding flow.
 * - `renderInsulinSelector(type, label)`: A helper function that renders the UI for selecting an insulin manufacturer
 *   and type, reducing code duplication for long-acting and short-acting insulin sections.
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import medicatieData from '../../../Data/MedicatieDataSet.json';
import Navbar from '../../../components/Navbar.jsx';
import './Onboarding.css'; // Gebruik de nieuwe gedeelde CSS

function MedicineInfo() {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding();

    // Initialiseer state vanuit context of met standaardwaarden
    const [formData, setFormData] = useState({
        diabetesType: onboardingData.medicineInfo?.diabetesType || '',
        gebruiktInsuline: onboardingData.medicineInfo?.gebruiktInsuline || 'nee',
        longActing: onboardingData.medicineInfo?.longActing || { manufacturer: '', insulin: '' },
        shortActing: onboardingData.medicineInfo?.shortActing || { manufacturer: '', insulin: '' },
    });
    const [error, setError] = useState('');

    const manufacturers = useMemo(() => {
        const allManufacturers = medicatieData.map(item => item.Fabrikant);
        return [...new Set(allManufacturers)].sort();
    }, []);

    const handleChange = (e, insulinCategory, field) => {
        const { value } = e.target;
        setFormData(prevState => {
            const updatedCategory = { ...prevState[insulinCategory], [field]: value };
            if (field === 'manufacturer') {
                updatedCategory.insulin = ''; // Reset insulinekeuze bij wisselen van fabrikant
            }
            return { ...prevState, [insulinCategory]: updatedCategory };
        });
    };

    const handleTopLevelChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.diabetesType) {
            setError('Selecteer alsjeblieft je type diabetes.');
            return;
        }

        updateOnboardingData({ medicineInfo: formData });
        // Navigeer naar de laatste stap van de onboarding
        navigate('/onboarding/devices');
    };

    const renderInsulinSelector = (type, label) => {
        const category = type === 'long' ? 'longActing' : 'shortActing';
        const selectedManufacturer = formData[category].manufacturer;

        return (
            <div className="device-category-box" style={{marginTop: 0}}>
                <h2>{label}</h2>
                <div className="input-group">
                    <label htmlFor={`${category}-manufacturer`}>Fabrikant</label>
                    <select
                        id={`${category}-manufacturer`}
                        value={selectedManufacturer}
                        onChange={(e) => handleChange(e, category, 'manufacturer')}
                    >
                        <option value="">Kies een fabrikant</option>
                        {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor={`${category}-insulin`}>Insulinesoort</label>
                    <select
                        id={`${category}-insulin`}
                        value={formData[category].insulin}
                        onChange={(e) => handleChange(e, category, 'insulin')}
                        disabled={!selectedManufacturer}
                    >
                        <option value="">Kies een insuline</option>
                        {selectedManufacturer && medicatieData
                            .filter(insuline => insuline.Fabrikant === selectedManufacturer)
                            .map((insuline, index) => (
                                <option key={index} value={insuline.Merknaam}>
                                    {insuline.Merknaam} ({insuline["Generieke naam"]})
                                </option>
                            ))
                        }
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
                        <h1>Medische Informatie</h1>
                        <p>Deze informatie helpt ons om de app beter op jou af te stemmen.</p>

                        <div className="input-group">
                            <label htmlFor="diabetesType">Welk type diabetes heb je?</label>
                            <select id="diabetesType" name="diabetesType" value={formData.diabetesType} onChange={handleTopLevelChange} required>
                                <option value="" disabled>-- Maak een keuze --</option>
                                <option value="Type 1">Type 1</option>
                                <option value="Type 2">Type 2</option>
                                <option value="LADA">LADA</option>
                                <option value="MODY">MODY</option>
                                <option value="Zwangerschapsdiabetes">Zwangerschapsdiabetes</option>
                                <option value="Anders">Anders/Onbekend</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Gebruik je insuline?</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input type="radio" name="gebruiktInsuline" value="ja" checked={formData.gebruiktInsuline === 'ja'} onChange={handleTopLevelChange} />
                                    <span>Ja</span>
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="gebruiktInsuline" value="nee" checked={formData.gebruiktInsuline === 'nee'} onChange={handleTopLevelChange} />
                                    <span>Nee</span>
                                </label>
                            </div>
                        </div>

                        {formData.gebruiktInsuline === 'ja' && (
                            <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-5)'}}>
                                {renderInsulinSelector('long', 'Langwerkende Insuline')}
                                {renderInsulinSelector('short', 'Kortwerkende Insuline')}
                            </div>
                        )}

                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="btn btn--primary form-action-button">Volgende stap</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default MedicineInfo;
