import React, { useState, useEffect } from "react";
// VERBETERING: We gebruiken de centrale useAuth hook.
import { useAuth } from "../../contexts/AuthContext.jsx";
// De service om het profiel bij te werken, blijft nodig.
import { updateUserProfile } from "../../services/ProfileService.jsx";
import './DashboardPage.css'; // Zorg dat dit CSS-bestand bestaat voor styling.

export default function DashboardPage() {
    // Haal de gebruiker en de functie om de gebruiker te updaten direct uit de AuthContext.
    // Dit is nu de enige bron van waarheid voor gebruikersdata.
    const { user, setUser } = useAuth();

    // State voor de UI, zoals de bewerkmodus en feedbackberichten.
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Dit effect zorgt ervoor dat het formulier wordt gevuld zodra de user-data beschikbaar is.
    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    // Als de gebruiker of formulierdata nog niet geladen is, toon een laadbericht.
    if (!formData) {
        return <div>Profiel wordt geladen...</div>;
    }

    // Functie om de input van het formulier te verwerken.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Schakelt de bewerkmodus aan of uit.
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        // Reset het formulier en eventuele foutmeldingen als de gebruiker annuleert.
        if (isEditing) {
            setFormData(user);
            setError('');
            setSuccess('');
        }
    };

    // Functie die wordt aangeroepen bij het opslaan van het formulier.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const updatedProfile = await updateUserProfile(formData);
            // Update de globale 'user' state in de AuthContext.
            // Hierdoor is de wijziging direct in de hele app zichtbaar.
            setUser(updatedProfile);
            setSuccess('Profiel succesvol bijgewerkt!');
            setIsEditing(false);
        } catch (err) {
            setError('Er is iets misgegaan bij het bijwerken van het profiel.');
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="profile-card">
                <h2>Welkom, {user.firstName}!</h2>
                {/* Toon feedbackberichten in de UI i.p.v. met alert() */}
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                {isEditing ? (
                    // De view voor als de gebruiker aan het bewerken is.
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Voornaam:</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Achternaam:</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} disabled />
                        </div>
                        <div className="button-group">
                            <button type="submit" className="save-button">Opslaan</button>
                            <button type="button" onClick={handleEditToggle} className="cancel-button">Annuleren</button>
                        </div>
                    </form>
                ) : (
                    // De view voor als de gebruiker niet aan het bewerken is.
                    <div className="profile-details">
                        <p><strong>Voornaam:</strong> {user.firstName}</p>
                        <p><strong>Achternaam:</strong> {user.lastName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <button onClick={handleEditToggle} className="edit-button">Profiel bewerken</button>
                    </div>
                )}
            </div>
        </div>
    );
}
