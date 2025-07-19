// src/pages/Authorization/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext.jsx';
import { fetchUserProfile, updateUserProfile } from '../../services/profileService.jsx';

export default function DashboardPage() {
    const { user } = useUser();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await fetchUserProfile();
                setProfile(data);
            } catch (err) {
                setError('Kon profiel niet laden.');
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const updated = await updateUserProfile(profile);
            setProfile(updated);
            alert('Profiel opgeslagen!');
        } catch {
            alert('Fout bij opslaan profiel.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Bezig met laden…</p>;
    if (error)   return <p>{error}</p>;

    return (
        <div className="dashboard-page">
            <h1>Welkom, {user?.email}</h1>

            <section>
                <h2>Profielgegevens</h2>
                <label>
                    Naam:
                    <input
                        type="text"
                        value={profile.name || ''}
                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                    />
                </label>
                <label>
                    Leeftijd:
                    <input
                        type="number"
                        value={profile.age || ''}
                        onChange={e => setProfile({ ...profile, age: e.target.value })}
                    />
                </label>
                {/* Voeg hier eventuele extra velden toe */}
                <button onClick={handleSave} disabled={loading}>
                    {loading ? 'Opslaan…' : 'Opslaan'}
                </button>
            </section>
        </div>
    );
}
