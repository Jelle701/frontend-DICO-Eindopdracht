/**
 * @file OnboardingPreferences.jsx
 * @description This is a step in the patient onboarding process where the user provides personal preferences and
 * biometric data. It collects the preferred glucose measurement unit, gender, weight, and height. It also provides
 * real-time BMI calculation for user feedback.
 *
 * @component
 * @returns {JSX.Element} The rendered personal preferences form.
 *
 * @functions
 * - `OnboardingPreferences()`: The main functional component that manages the form state and logic.
 * - `handleChange(e)`: Updates the form state as the user enters their information.
 * - `useEffect()`: A React hook that calculates the user's Body Mass Index (BMI) whenever the weight or height
 *   values change, providing immediate feedback.
 * - `handleSubmit(e)`: Validates the form, saves the collected preferences to the central `OnboardingContext`,
 *   and navigates the user to the next step in the onboarding flow (`/onboarding/medicine`).
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import Navbar from '../../../components/Navbar.jsx';
import './Onboarding.css'; // Gebruik de nieuwe gedeelde CSS

function OnboardingPreferences() {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [formData, setFormData] = useState({
        eenheid: onboardingData.preferences?.eenheid || 'mmol/L',
        geslacht: onboardingData.preferences?.geslacht || '',
        gewicht: onboardingData.preferences?.gewicht || '',
        lengte: onboardingData.preferences?.lengte || ''
    });
    const [bmi, setBmi] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {
        const { gewicht, lengte } = formData;
        if (gewicht > 0 && lengte > 0) {
            const lengteInMeters = lengte / 100;
            const calculatedBmi = (gewicht / (lengteInMeters * lengteInMeters)).toFixed(1);
            setBmi(calculatedBmi);
        } else {
            setBmi(null);
        }
    }, [formData.gewicht, formData.lengte]);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateOnboardingData({ preferences: formData });
        // Navigate to the new, correct route
        navigate('/onboarding/medicine');
    };

    return (
        <>
            <Navbar />
            <div className="onboarding-page-container">
                <div className="auth-page">
                    <form onSubmit={handleSubmit}>
                        <h1>Persoonlijke voorkeuren</h1>
                        <p>Deze gegevens helpen ons om de informatie beter op uw situatie af te stemmen.</p>

                        <div className="input-group">
                            <label>Eenheid voor glucosemeting</label>
                            <select name="eenheid" value={formData.eenheid} onChange={handleChange}>
                                <option value="mmol/L">mmol/L</option>
                                <option value="mg/dL">mg/dL</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="geslacht">Geslacht</label>
                            <select id="geslacht" name="geslacht" value={formData.geslacht} onChange={handleChange} required>
                                <option value="" disabled>-- Maak een keuze --</option>
                                <option value="Man">Man</option>
                                <option value="Vrouw">Vrouw</option>
                                <option value="Anders">Anders</option>
                                <option value="Zeg ik liever niet">Zeg ik liever niet</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="gewicht">Gewicht (kg)</label>
                            <input type="number" id="gewicht" name="gewicht" value={formData.gewicht} onChange={handleChange} required placeholder="bv. 75" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="lengte">Lengte (cm)</label>
                            <input type="number" id="lengte" name="lengte" value={formData.lengte} onChange={handleChange} required placeholder="bv. 180" />
                        </div>

                        {bmi && <p style={{textAlign: 'center', marginTop: 'calc(-1 * var(--space-5))'}}>Je berekende BMI is: <strong>{bmi}</strong></p>}
                        
                        <button type="submit" className="btn btn--primary form-action-button">Volgende stap</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default OnboardingPreferences;
