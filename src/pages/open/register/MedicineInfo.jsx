import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DevBypassValidation from '../../../components/devtools/BypassRequiredFields.jsx';
import medicatieOpties from '../../../Data/MedicatieDataSet.json';

function MedicineInfo() {
    const [usesMedication, setUsesMedication] = useState('');
    const [manufacturer1, setManufacturer1] = useState('');
    const [manufacturer2, setManufacturer2] = useState('');
    const [med1, setMed1] = useState('');
    const [med2, setMed2] = useState('');

    const navigate = useNavigate();

    const uniqueManufacturers = [...new Set(medicatieOpties.map(med => med.Fabrikant))].sort();

    const getMedicinesByManufacturer = (man) =>
        medicatieOpties.filter((med) => med.Fabrikant === man);

    const handleSubmit = (e) => {
        e.preventDefault();

        const medicineData = {
            usesMedication,
            medicationDetails: [
                manufacturer1 && med1 ? { fabrikant: manufacturer1, merknaam: med1 } : null,
                manufacturer2 && med2 ? { fabrikant: manufacturer2, merknaam: med2 } : null,
            ].filter(Boolean),
        };

        localStorage.setItem('medicineInfo', JSON.stringify(medicineData));
        navigate('/devices');
    };

    return (
        <div className="auth-page container">
            <DevBypassValidation active={true} />

            <h1>Medicatie</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                <label>Gebruik je momenteel medicatie voor diabetes?</label>
                <select
                    value={usesMedication}
                    onChange={(e) => setUsesMedication(e.target.value)}
                    required
                >
                    <option value="">Maak een keuze</option>
                    <option value="ja">Ja</option>
                    <option value="nee">Nee</option>
                </select>

                {usesMedication === 'ja' && (
                    <>
                        {/* Eerste medicijn */}
                        <label>Fabrikant van eerste medicijn:</label>
                        <select
                            value={manufacturer1}
                            onChange={(e) => {
                                setManufacturer1(e.target.value);
                                setMed1('');
                            }}
                            required
                        >
                            <option value="">Selecteer fabrikant</option>
                            {uniqueManufacturers.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>

                        {manufacturer1 && (
                            <>
                                <label>Medicijn 1:</label>
                                <select
                                    value={med1}
                                    onChange={(e) => setMed1(e.target.value)}
                                    required
                                >
                                    <option value="">Selecteer medicijn</option>
                                    {getMedicinesByManufacturer(manufacturer1).map((m) => (
                                        <option key={m.Merknaam} value={m.Merknaam}>
                                            {m.Merknaam} – {m.Type}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        {/* Tweede medicijn */}
                        <label>Fabrikant van tweede medicijn (optioneel):</label>
                        <select
                            value={manufacturer2}
                            onChange={(e) => {
                                setManufacturer2(e.target.value);
                                setMed2('');
                            }}
                        >
                            <option value="">Selecteer fabrikant</option>
                            {uniqueManufacturers.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>

                        {manufacturer2 && (
                            <>
                                <label>Medicijn 2:</label>
                                <select
                                    value={med2}
                                    onChange={(e) => setMed2(e.target.value)}
                                >
                                    <option value="">Selecteer medicijn</option>
                                    {getMedicinesByManufacturer(manufacturer2).map((m) => (
                                        <option key={m.Merknaam} value={m.Merknaam}>
                                            {m.Merknaam} – {m.Type}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                    </>
                )}

                <button type="submit">Volgende</button>
            </form>
        </div>
    );
}

export default MedicineInfo;
