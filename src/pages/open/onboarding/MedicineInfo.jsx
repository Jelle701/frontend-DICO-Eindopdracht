// src/pages/open/onboarding/MedicineInfo.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import medicatieData from '../../../Data/MedicatieDataSet.json'; // Correcte import
import './RegisterPage.css';

function MedicineInfo() {
    const navigate = useNavigate();
    const { updateOnboardingData } = useOnboarding();

    const [formData, setFormData] = useState({
        diabetesType: '',
        gebruiktInsuline: 'nee',
        longActing: { manufacturer: '', insulin: '' },
        shortActing: { manufacturer: '', insulin: '' },
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
                updatedCategory.insulin = '';
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

        const dataToStore = {
            diabetesType: formData.diabetesType,
            gebruiktInsuline: formData.gebruiktInsuline,
        };

        if (formData.gebruiktInsuline === 'ja') {
            if (formData.longActing.insulin) {
                dataToStore.longActingInsulin = formData.longActing.insulin;
            }
            if (formData.shortActing.insulin) {
                dataToStore.shortActingInsulin = formData.shortActing.insulin;
            }
        }

        // Sla alleen de data voor deze stap op
        updateOnboardingData({ medicineInfo: dataToStore });
        // Stuur de gebruiker naar de VOLGENDE stap
        navigate('/devices');
    };

    const renderInsulinSelector = (type, label) => {
        const category = type === 'long' ? 'longActing' : 'shortActing';
        const selectedManufacturer = formData[category].manufacturer;

        return (
            <div className="insulin-selector-group">
                <h4>{label}</h4>
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
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h1>Medische Informatie</h1>
                <p>Deze informatie helpt ons om de app beter op jou af te stemmen.</p>

                <div className="input-group">
                    <label htmlFor="diabetesType">Welk type diabetes heb je?</label>
                    <select id="diabetesType" name="diabetesType" value={formData.diabetesType} onChange={handleTopLevelChange} required>
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
                        <input type="radio" id="insulineJa" name="gebruiktInsuline" value="ja" checked={formData.gebruiktInsuline === 'ja'} onChange={handleTopLevelChange} />
                        <label htmlFor="insulineJa" style={{ marginRight: '1rem' }}>Ja</label>
                        <input type="radio" id="insulineNee" name="gebruiktInsuline" value="nee" checked={formData.gebruiktInsuline === 'nee'} onChange={handleTopLevelChange} />
                        <label htmlFor="insulineNee">Nee</label>
                    </div>
                </div>

                {formData.gebruiktInsuline === 'ja' && (
                    <>
                        {renderInsulinSelector('long', 'Langwerkende Insuline')}
                        {renderInsulinSelector('short', 'Kortwerkende Insuline (voor maaltijden)')}
                    </>
                )}

                {error && <p className="error-message">{error}</p>}
                <button type="submit">Volgende stap</button>
            </form>
        </div>
    );
}

export default MedicineInfo;