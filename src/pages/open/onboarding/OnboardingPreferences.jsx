import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import Navbar from '../../../components/Navbar.jsx';
import './RegisterPage.css';

function OnboardingPreferences() {
    const navigate = useNavigate();
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [formData, setFormData] = useState({
        // VERWIJDERD: eenheid is verplaatst
        firstName: onboardingData.preferences?.firstName || '', // NIEUW
        lastName: onboardingData.preferences?.lastName || '',   // NIEUW
        geslacht: onboardingData.preferences?.geslacht || '',
        gewicht: onboardingData.preferences?.gewicht || '',
        lengte: onboardingData.preferences?.lengte || '',
        dateOfBirth: onboardingData.preferences?.dateOfBirth || ''
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
        navigate('/onboarding/medicine');
    };

    return (
        <>
            <Navbar />
            <div className="onboarding-page-container">
                <div className="auth-page">
                    <form onSubmit={handleSubmit}>
                        <h1>Persoonlijke Gegevens</h1>
                        <p>Deze gegevens helpen ons om de informatie beter op uw situatie af te stemmen.</p>

                        {/* NIEUWE VELDEN */}
                        <div className="input-group">
                            <label htmlFor="firstName">Voornaam</label>
                            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="bv. Jan" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="lastName">Achternaam</label>
                            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="bv. Jansen" />
                        </div>

                        <div className="input-group">
                            <label htmlFor="dateOfBirth">Geboortedatum</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                        </div>

                        {/* VERWIJDERD: Eenheid voor glucosemeting */}

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
