import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from 'src/contexts/UserContext.jsx';
import DevBypassValidation from '../../../components/devtools/BypassRequiredFields.jsx';

function OnboardingPreferences() {
    const [system, setSystem] = useState('metric');
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);

    const navigate = useNavigate();
    const { login } = useUser();

    useEffect(() => {
        const h = parseFloat(height);
        const w = parseFloat(weight);
        if (w > 0 && h > 0) {
            const calculatedBmi = system === 'metric'
                ? w / ((h / 100) ** 2)
                : (w / (h ** 2)) * 703;
            setBmi(calculatedBmi.toFixed(1));
        } else {
            setBmi(null);
        }
    }, [weight, height, system]);

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //
    //     const preferences = {
    //         system,
    //         gender,
    //         weight,
    //         height,
    //         bmi,
    //     };
    //
    //     localStorage.setItem('userPreferences', JSON.stringify(preferences));
    //     login({ email: 'dev@dico.app', password: 'test1234' }); // tijdelijk
    //     navigate('/medicine-info');
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        const preferences = {
            system,
            gender,
            weight,
            height,
            bmi,
        };

        localStorage.setItem('userPreferences', JSON.stringify(preferences));

        // login() NIET hier uitvoeren!
        navigate('/medicine-info');
    };

    return (
        <>
            <DevBypassValidation active={true} />

            <div className="auth-page container">
                <h1>Persoonlijke instellingen</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-1">

                    <label>Meeteenheid:</label>
                    <select value={system} onChange={(e) => setSystem(e.target.value)} required>
                        <option value="metric">Metrisch (kg / cm)</option>
                        <option value="imperial">Imperiaal (lbs / inch)</option>
                    </select>

                    <label>Geslacht:</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                        <option value="">Selecteer geslacht</option>
                        <option value="man">Man</option>
                        <option value="vrouw">Vrouw</option>
                        <option value="anders">Anders</option>
                    </select>

                    <label>Gewicht ({system === 'metric' ? 'kg' : 'lbs'}):</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                    />

                    <label>Lengte ({system === 'metric' ? 'cm' : 'inch'}):</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                    />

                    {bmi && <p><strong>BMI:</strong> {bmi}</p>}

                    <button type="submit">Start met DICO</button>
                </form>
            </div>
        </>
    );
}

export default OnboardingPreferences;
