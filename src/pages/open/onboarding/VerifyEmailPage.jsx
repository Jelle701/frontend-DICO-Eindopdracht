import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../open/register/RegisterPage.css';

function OnboardingPreferences() {
    const [formData, setFormData] = useState({
        geboortedatum: '',
        gewicht: '',
        lengte: ''
    });
    const [bmi, setBmi] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    useEffect(() => {
        if (formData.gewicht > 0 && formData.lengte > 0) {
            const lengteInMeters = formData.lengte / 100;
            const berekendeBmi = (formData.gewicht / (lengteInMeters * lengteInMeters)).toFixed(1);
            setBmi(berekendeBmi);
        } else {
            setBmi(null);
        }
    }, [formData.gewicht, formData.lengte]);

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('onboardingPreferences', JSON.stringify(formData));
        navigate('/medicine-info');
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Persoonlijke gegevens</h1>
                <p>Deze gegevens helpen ons om je een persoonlijkere ervaring te geven.</p>

                <div className="input-group">
                    <label htmlFor="geboortedatum">Geboortedatum</label>
                    <input type="date" id="geboortedatum" name="geboortedatum" value={formData.geboortedatum} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="gewicht">Gewicht (in kg)</label>
                    <input type="number" id="gewicht" name="gewicht" value={formData.gewicht} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label htmlFor="lengte">Lengte (in cm)</label>
                    <input type="number" id="lengte" name="lengte" value={formData.lengte} onChange={handleChange} required />
                </div>

                {bmi && <p>Je berekende BMI is: <strong>{bmi}</strong></p>}

                <button type="submit">Volgende stap</button>
            </form>
        </div>
    );
}

export default OnboardingPreferences;