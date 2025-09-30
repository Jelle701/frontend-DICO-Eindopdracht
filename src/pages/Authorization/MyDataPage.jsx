import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../services/ProfileService';
import Navbar from '../../components/Navbar';
import medicatieData from '../../Data/MedicatieDataSet.json';
import devicesData from '../../Data/DiabeticDevices.json';
import './MyDataPage.css';

// --- Data & Mappings ---
const GENDER_OPTIONS = { MALE: 'Man', FEMALE: 'Vrouw', OTHER: 'Anders', PREFER_NOT_TO_SAY: 'Zeg ik liever niet' };
const DIABETES_TYPE_OPTIONS = { TYPE_1: 'Type 1', TYPE_2: 'Type 2', LADA: 'LADA', MODY: 'MODY', GESTATIONAL: 'Zwangerschapsdiabetes', OTHER: 'Anders/Onbekend' };
const SYSTEM_OPTIONS = { METRIC: 'mmol/L', IMPERIAL: 'mg/dL' };

const findManufacturerByInsulin = (insulinName) => {
    if (!insulinName) return '';
    const insulinEntry = medicatieData.find(item => item.Merknaam.toUpperCase().replace(/ /g, '_') === insulinName);
    return insulinEntry ? insulinEntry.Fabrikant : '';
};

function MyDataPage() {
    const { user, setUserData, loading: userLoading } = useUser();

    const [formState, setFormState] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { longManufacturers, shortManufacturers, insulinsByManufacturer } = useMemo(() => {
        const long = new Set(), short = new Set(), byManufacturer = {};
        const longTypes = ["Long-acting", "Ultra-long acting", "Intermediate"];
        const shortTypes = ["Short-acting", "Rapid-acting", "Ultra-rapid"];
        medicatieData.forEach(item => {
            if (!byManufacturer[item.Fabrikant]) byManufacturer[item.Fabrikant] = [];
            byManufacturer[item.Fabrikant].push(item.Merknaam);
            const type = item.Type || '';
            if (longTypes.some(t => type.includes(t))) long.add(item.Fabrikant);
            else if (shortTypes.some(t => type.includes(t))) short.add(item.Fabrikant);
        });
        return { longManufacturers: Array.from(long).sort(), shortManufacturers: Array.from(short).sort(), insulinsByManufacturer: byManufacturer };
    }, []);

    useEffect(() => {
        if (user) {
            const findDevice = (categoryKey) => {
                if (!user.diabeticDevices) return { brand: '', model: '' };
                const categoryMappings = {
                    cgm: ['cgm'],
                    insulinPump: ['insulinpump', 'pomp'],
                    bloodGlucoseMeter: ['bloodglucosemeter', 'meter']
                };
                const possibleBackendCategories = categoryMappings[categoryKey] || [categoryKey];
                const device = user.diabeticDevices.find(d => 
                    d.category && possibleBackendCategories.includes(d.category.toLowerCase())
                );
                return device ? { brand: device.brand, model: device.model } : { brand: '', model: '' };
            };

            setFormState({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
                gender: user.gender || '',
                height: user.height || '',
                weight: user.weight || '',
                system: user.system || 'METRIC',
                diabetesType: user.diabetesType || '',
                longActing: { insulin: user.longActingInsulin ? medicatieData.find(m => m.Merknaam.toUpperCase().replace(/ /g, '_') === user.longActingInsulin)?.Merknaam || '' : '', manufacturer: findManufacturerByInsulin(user.longActingInsulin) },
                shortActing: { insulin: user.shortActingInsulin ? medicatieData.find(m => m.Merknaam.toUpperCase().replace(/ /g, '_') === user.shortActingInsulin)?.Merknaam || '' : '', manufacturer: findManufacturerByInsulin(user.shortActingInsulin) },
                devices: { cgm: findDevice('cgm'), insulinPump: findDevice('insulinPump'), bloodGlucoseMeter: findDevice('bloodGlucoseMeter') }
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => {
            if (!prev) return null;
            return { ...prev, [name]: value };
        });
    };

    const handleNestedChange = (category, field, value) => {
        setFormState(prev => {
            if (!prev) return null;
            const updatedCategory = { ...prev[category], [field]: value };
            if (field === 'manufacturer') updatedCategory.insulin = '';
            return { ...prev, [category]: updatedCategory };
        });
    };

    const handleDeviceChange = (category, field, value) => {
        setFormState(prev => {
            if (!prev) return null;
            const updatedDevices = { ...prev.devices, [category]: { ...prev.devices[category], [field]: value } };
            if (field === 'brand') updatedDevices[category].model = '';
            return { ...prev, devices: updatedDevices };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        if (user.role === 'PATIENT' && (!formState.gender || !formState.diabetesType)) {
            setError('Voor patiënten zijn geslacht en diabetes type verplichte velden.');
            setIsSubmitting(false);
            return;
        }

        const toInsulinEnum = (name) => name ? name.toUpperCase().replace(/ /g, '_') : null;
        const selectedDevices = Object.entries(formState.devices).map(([key, value]) => ({ ...value, category: key })).filter(device => device.brand && device.model);

        const payload = {
            role: user.role,
            firstName: formState.firstName || null,
            lastName: formState.lastName || null,
            dateOfBirth: formState.dateOfBirth || null,
            gender: formState.gender || null,
            height: parseFloat(formState.height) || 0,
            weight: parseFloat(formState.weight) || 0,
            system: formState.system || null,
            diabetesType: formState.diabetesType || null,
            longActingInsulin: toInsulinEnum(formState.longActing.insulin),
            shortActingInsulin: toInsulinEnum(formState.shortActing.insulin),
            diabeticDevices: selectedDevices,
        };

        try {
            const { data, error: updateError } = await updateUserProfile(payload);

            if (updateError) {
                setError(updateError.message || 'Er is een onbekende fout opgetreden.');
            } else {
                setSuccess('Gegevens succesvol bijgewerkt!');
                setUserData(data);
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.message || 'Er is een onbekende fout opgetreden.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderInsulinSelector = (type, label, manufacturers) => {
        const category = type === 'long' ? 'longActing' : 'shortActing';
        const selection = formState[category];
        const availableInsulins = selection.manufacturer ? (insulinsByManufacturer[selection.manufacturer] || []) : [];
        return (
            <div className="form-subsection">
                <h4>{label}</h4>
                <div className="input-group"><label>Fabrikant</label><select value={selection.manufacturer} onChange={(e) => handleNestedChange(category, 'manufacturer', e.target.value)}><option value="">-- Kies Fabrikant --</option>{manufacturers.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                <div className="input-group"><label>Insulinesoort</label><select value={selection.insulin} onChange={(e) => handleNestedChange(category, 'insulin', e.target.value)} disabled={!selection.manufacturer}><option value="">-- Kies Insuline --</option>{availableInsulins.map(i => <option key={i} value={i}>{i}</option>)}</select></div>
            </div>
        );
    };

    const renderDeviceSelector = (categoryKey, categoryName) => {
        const categoryData = devicesData[categoryName] || [];
        const selection = formState.devices[categoryKey];
        const models = selection.brand ? (categoryData.find(b => b.Merk === selection.brand)?.Modellen || []) : [];
        return (
            <div className="form-subsection">
                <h4>{categoryName}</h4>
                <div className="input-group"><label>Merk</label><select value={selection.brand} onChange={(e) => handleDeviceChange(categoryKey, 'brand', e.target.value)}><option value="">-- Kies Merk --</option>{categoryData.map(b => <option key={b.Merk} value={b.Merk}>{b.Merk}</option>)}</select></div>
                <div className="input-group"><label>Model</label><select value={selection.model} onChange={(e) => handleDeviceChange(categoryKey, 'model', e.target.value)} disabled={!selection.brand}><option value="">-- Kies Model --</option>{models.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
            </div>
        );
    };

    if (userLoading || !formState) {
        return <><Navbar /><div className="my-data-page"><p>Gegevens worden geladen...</p></div></>;
    }

    return (
        <>
            <Navbar />
            <div className="my-data-page">
                <form className="form-card" onSubmit={handleSubmit}>
                    <header className="form-header"><h1>Mijn Gegevens</h1></header>

                    <div className="form-section"><h2>Persoonlijke Gegevens</h2>
                        <div className="input-group"><label>Voornaam</label><input type="text" name="firstName" value={formState.firstName || ''} onChange={handleInputChange} required /></div>
                        <div className="input-group"><label>Achternaam</label><input type="text" name="lastName" value={formState.lastName || ''} onChange={handleInputChange} required /></div>
                        <div className="input-group"><label>Geboortedatum</label><input type="date" name="dateOfBirth" value={formState.dateOfBirth} onChange={handleInputChange} required /></div>
                        <div className="input-group"><label>Geslacht</label><select name="gender" value={formState.gender || ''} onChange={handleInputChange} required={user.role === 'PATIENT'}>
                            <option value="" disabled>-- Kies een optie --</option>
                            {Object.entries(GENDER_OPTIONS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </select></div>
                    </div>

                    <div className="form-section"><h2>Fysieke Gegevens</h2>
                        <div className="input-group"><label>Lengte (cm)</label><input type="number" name="height" value={formState.height || ''} onChange={handleInputChange} required /></div>
                        <div className="input-group"><label>Gewicht (kg)</label><input type="number" name="weight" value={formState.weight || ''} onChange={handleInputChange} required /></div>
                    </div>

                    <div className="form-section"><h2>Medische Informatie</h2>
                        <div className="input-group"><label>Glucosemeting Eenheid</label><select name="system" value={formState.system || 'METRIC'} onChange={handleInputChange}>{Object.entries(SYSTEM_OPTIONS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
                        <div className="input-group"><label>Type Diabetes</label><select name="diabetesType" value={formState.diabetesType || ''} onChange={handleInputChange} required={user.role === 'PATIENT'}>
                            <option value="" disabled>-- Kies een optie --</option>
                            {Object.entries(DIABETES_TYPE_OPTIONS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </select></div>
                        {renderInsulinSelector('long', 'Langwerkende Insuline', longManufacturers)}
                        {renderInsulinSelector('short', 'Kortwerkende Insuline', shortManufacturers)}
                    </div>

                    <div className="form-section"><h2>Hulpmiddelen</h2>
                        {renderDeviceSelector('cgm', 'CGM')}
                        {renderDeviceSelector('insulinPump', 'Insulinepompen')}
                        {renderDeviceSelector('bloodGlucoseMeter', 'Bloedglucosemeters')}
                    </div>

                    {success && <p className="form-message success">{success}</p>}
                    {error && <p className="form-message error">{error}</p>}

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Bezig met opslaan...' : 'Gegevens Opslaan'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default MyDataPage;
