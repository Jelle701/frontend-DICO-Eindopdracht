// src/pages/Authorization/MyDataPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyProfile } from '../../services/ProfileService';
import './MyDataPage.css';

function MyDataPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { data, error: fetchError } = await getMyProfile();
            if (fetchError) {
                setError(fetchError.message);
            } else {
                setProfile(data);
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div className="my-data-page"><p>Gegevens worden geladen...</p></div>;
    }

    if (error) {
        return <div className="my-data-page error-message"><p>Fout: {error}</p></div>;
    }

    if (!profile) {
        return <div className="my-data-page"><p>Geen profielgegevens gevonden.</p></div>;
    }

    // Helper om data netjes weer te geven
    const renderDataItem = (label, value) => (
        <div className="data-item">
            <span className="data-label">{label}:</span>
            <span className="data-value">{value || 'Niet opgegeven'}</span>
        </div>
    );

    return (
        <div className="my-data-page">
            <h1>Mijn Gegevens</h1>

            <div className="data-section">
                <h2>Persoonlijke Gegevens</h2>
                {renderDataItem('Voornaam', profile.firstName)}
                {renderDataItem('Achternaam', profile.lastName)}
                {renderDataItem('E-mailadres', profile.email)}
                {renderDataItem('Geboortedatum', profile.dob)}
                {renderDataItem('Rol', profile.role)}
            </div>

            {profile.preferences && (
                <div className="data-section">
                    <h2>Voorkeuren</h2>
                    {renderDataItem('Meetsysteem', profile.preferences.system)}
                    {renderDataItem('Geslacht', profile.preferences.gender)}
                    {renderDataItem('Gewicht', `${profile.preferences.weight} kg`)}
                    {renderDataItem('Lengte', `${profile.preferences.height} cm`)}
                    {renderDataItem('BMI', profile.preferences.bmi)}
                </div>
            )}

            {/* --- NIEUWE SECTIE --- */}
            {profile.medicineInfo && (
                <div className="data-section">
                    <h2>Medische Informatie</h2>
                    {renderDataItem('Type Diabetes', profile.medicineInfo.diabetesType)}
                    {profile.medicineInfo.longActingInsulin && renderDataItem('Langwerkende Insuline', profile.medicineInfo.longActingInsulin)}
                    {profile.medicineInfo.shortActingInsulin && renderDataItem('Kortwerkende Insuline', profile.medicineInfo.shortActingInsulin)}
                </div>
            )}
            {/* --- EINDE NIEUWE SECTIE --- */}


            {profile.diabeticDevices && profile.diabeticDevices.length > 0 && (
                <div className="data-section">
                    <h2>Medische Hulpmiddelen</h2>
                    {profile.diabeticDevices.map((device, index) => (
                        <div key={index} className="device-card">
                            <h3 className="device-category">{device.categorie}</h3>
                            {renderDataItem('Fabrikant', device.fabrikant)}
                            {renderDataItem('Model', device.model)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyDataPage;