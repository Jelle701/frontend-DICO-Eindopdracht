import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import medicatieData from '../../../Data/MedicatieDataSet.json';
import './RegisterPage.css';

function MedicineInfo() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        diabetesType: '',
        gebruiktInsuline: 'nee', // Standaard 'nee'
        insulineSoort: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
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

        if (formData.gebruiktInsuline === 'ja' && !formData.insulineSoort) {
            setError('Selecteer alsjeblieft je type insuline.');
            return;
        }

        try {
            // Verwijder insulineSoort als de gebruiker geen insuline gebruikt
            const dataToStore = { ...formData };
            if (dataToStore.gebruiktInsuline === 'nee') {
                delete dataToStore.insulineSoort;
            }
            localStorage.setItem('onboardingMedicine', JSON.stringify(dataToStore));
            navigate('/devices'); // Navigeer naar de volgende stap
        } catch (error) {
            console.error("Kon medicatiegegevens niet opslaan in localStorage", error);
            setError("Er is iets misgegaan. Probeer het opnieuw.");
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Medische Informatie</h1>
                <p>Deze informatie helpt ons om de app beter op jou af te stemmen.</p>

                <div className="input-group">
                    <label htmlFor="diabetesType">Welk type diabetes heb je?</label>
                    <select id="diabetesType" name="diabetesType" value={formData.diabetesType} onChange={handleChange} required>
                        <option value="">Kies een type</option>
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
                    <div>
                        <input type="radio" id="insulineJa" name="gebruiktInsuline" value="ja" checked={formData.gebruiktInsuline === 'ja'} onChange={handleChange} />
                        <label htmlFor="insulineJa" style={{ marginRight: '1rem' }}>Ja</label>
                        <input type="radio" id="insulineNee" name="gebruiktInsuline" value="nee" checked={formData.gebruiktInsuline === 'nee'} onChange={handleChange} />
                        <label htmlFor="insulineNee">Nee</label>
                    </div>
                </div>

                {formData.gebruiktInsuline === 'ja' && (
                    <div className="input-group">
                        <label htmlFor="insulineSoort">Welke insuline gebruik je voornamelijk?</label>
                        <select id="insulineSoort" name="insulineSoort" value={formData.insulineSoort} onChange={handleChange}>
                            <option value="">Kies een insulinesoort</option>
                            {medicatieData.map((insuline, index) => (
                                <option key={index} value={insuline.Merknaam}>
                                    {insuline.Merknaam} ({insuline["Generieke naam"]})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}
                <button type="submit">Volgende stap</button>
            </form>
        </div>
    );
}

export default MedicineInfo;