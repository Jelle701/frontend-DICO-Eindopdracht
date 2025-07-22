import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// CORRECTIE: Importeer de stylesheet direct.
import './RegisterPage.css';

function OnboardingPreferences() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        eenheid: 'mmol/L',
        geslacht: '',
        gewicht: '',
        lengte: ''
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
        try {
            localStorage.setItem('onboardingPreferences', JSON.stringify(formData));
            navigate('/medicine-info');
        } catch (error) {
            console.error("Kon voorkeuren niet opslaan in localStorage", error);
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Persoonlijke voorkeuren</h1>
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
                        <option value="">Kies een optie</option>
                        <option value="Man">Man</option>
                        <option value="Vrouw">Vrouw</option>
                        <option value="Anders">Anders</option>
                        <option value="Zeg ik liever niet">Zeg ik liever niet</option>
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="gewicht">Gewicht (kg)</label>
                    <input type="number" id="gewicht" name="gewicht" value={formData.gewicht} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="lengte">Lengte (cm)</label>
                    <input type="number" id="lengte" name="lengte" value={formData.lengte} onChange={handleChange} required />
                </div>
                {bmi && <p>Je berekende BMI is: <strong>{bmi}</strong></p>}
                <button type="submit">Volgende stap</button>
            </form>
        </div>
    );
}

export default OnboardingPreferences;
