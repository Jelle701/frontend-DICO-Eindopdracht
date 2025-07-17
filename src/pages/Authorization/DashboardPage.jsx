// src/pages/Authorization/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
// Gebruik relatieve paden omdat de alias soms niet herkend wordt
import { useUser } from '../../contexts/UserContext.jsx';
import { fetchProfile } from '../../services/profileService.jsx';
import { getDevices } from '../../services/deviceService.jsx';
import '../../App.css';

function DashboardPage() {
    const { user, logout } = useUser();
    const [profile, setProfile] = useState(null);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');

        Promise.all([
            fetchProfile(user.id),
            getDevices(user.id),
        ])
            .then(([profileData, devicesData]) => {
                setProfile(profileData);
                setDevices(devicesData);
            })
            .catch((err) => {
                console.error(err);
                setError('Kon data niet laden. Probeer het later nog eens.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user]);

    if (loading) {
        return <p className="container">Laden…</p>;
    }

    if (error) {
        return <p className="container error">{error}</p>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header container flex justify-between">
                <h1>Dashboard</h1>
                <button onClick={logout} className="btn btn-outline">
                    Uitloggen
                </button>
            </header>

            <section className="dashboard-main container flex flex-col gap-4">
                {/* Profieldata */}
                {profile && (
                    <div className="dashboard-info">
                        <h2>Mijn Profiel</h2>
                        <p><strong>Naam:</strong> {profile.name}</p>
                        <p><strong>Leeftijd:</strong> {profile.age}</p>
                        <p><strong>Doel:</strong> {profile.goal}</p>
                    </div>
                )}

                {/* Apparaten */}
                <div className="dashboard-devices">
                    <h2>Apparaten</h2>
                    {devices.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {devices.map((device) => (
                                <li key={device.id}>
                                    {device.name} ({device.model})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Geen apparaten gevonden.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default DashboardPage;
