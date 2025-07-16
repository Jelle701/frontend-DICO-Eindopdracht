import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DevBypassValidation from '../../../components/devtools/BypassRequiredFields.jsx';
import deviceData from '../../../Data/DiabeticDevices.json';

function DiabeticDevices() {
    const navigate = useNavigate();

    const allDeviceTypes = ['Bloedglucosemeters', 'CGM', 'Insulinepompen'];
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedManufacturers, setSelectedManufacturers] = useState({});
    const [selectedModels, setSelectedModels] = useState({});

    const handleToggleType = (type) => {
        if (selectedTypes.includes(type)) {
            const updated = selectedTypes.filter(t => t !== type);
            setSelectedTypes(updated);
            const newManufacturers = { ...selectedManufacturers };
            const newModels = { ...selectedModels };
            delete newManufacturers[type];
            delete newModels[type];
            setSelectedManufacturers(newManufacturers);
            setSelectedModels(newModels);
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    const handleManufacturerChange = (type, manufacturer) => {
        const updated = { ...selectedManufacturers, [type]: manufacturer };
        setSelectedManufacturers(updated);
        setSelectedModels(prev => ({ ...prev, [type]: '' }));
    };

    const handleModelChange = (type, model) => {
        setSelectedModels(prev => ({ ...prev, [type]: model }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = selectedTypes.map((type) => ({
            categorie: type,
            fabrikant: selectedManufacturers[type] || '',
            model: selectedModels[type] || '',
        }));

        localStorage.setItem('diabeticDevices', JSON.stringify(result));
        navigate('/dashboard');
    };

    return (
        <div className="auth-page container">
            <DevBypassValidation active={true} />
            <h1>Diabeteshulpmiddelen</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <p>Welke hulpmiddelen gebruik je?</p>
                {allDeviceTypes.map((type) => (
                    <label key={type}>
                        <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => handleToggleType(type)}
                        />
                        {type}
                    </label>
                ))}

                {selectedTypes.map((type) => {
                    const fabrikanten = deviceData[type]?.map(d => d.Merk) || [];
                    const selectedFabrikant = selectedManufacturers[type];
                    const modellen = deviceData[type]?.find(d => d.Merk === selectedFabrikant)?.Modellen || [];

                    return (
                        <div key={type} className="device-selection">
                            <h4>{type}</h4>
                            <label>Fabrikant:</label>
                            <select
                                value={selectedFabrikant || ''}
                                onChange={(e) => handleManufacturerChange(type, e.target.value)}
                                required
                            >
                                <option value="">Selecteer fabrikant</option>
                                {fabrikanten.map(fab => (
                                    <option key={fab} value={fab}>{fab}</option>
                                ))}
                            </select>

                            {selectedFabrikant && (
                                <>
                                    <label>Model:</label>
                                    <select
                                        value={selectedModels[type] || ''}
                                        onChange={(e) => handleModelChange(type, e.target.value)}
                                        required
                                    >
                                        <option value="">Selecteer model</option>
                                        {modellen.map(mod => (
                                            <option key={mod} value={mod}>{mod}</option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>
                    );
                })}

                <button type="submit">Afronden</button>
            </form>
        </div>
    );
}

export default DiabeticDevices;
