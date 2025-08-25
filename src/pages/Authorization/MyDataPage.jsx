/**
 * @file MyDataPage.jsx
 * @description This page allows an authenticated user to view and update their personal profile information.
 * It fetches the user's current data from the backend and pre-fills a form. The user can then modify their
 * personal details, preferences (like gender and weight), and medical information (like diabetes type and insulin).
 *
 * @component
 * @returns {JSX.Element} The rendered user data and profile editing page.
 *
 * @functions
 * - `MyDataPage()`: The main functional component that manages the state for the form, loading, errors, and success messages.
 * - `useEffect()`: A React hook that calls `fetchProfile` once when the component mounts to load the user's data.
 * - `fetchProfile()`: An asynchronous function that retrieves the user's profile using the `getMyProfile` service and sets the initial form state.
 * - `handleInputChange(e)`: A flexible handler that updates the component's `formState`. It can handle both top-level
 *   properties (e.g., `firstName`) and nested properties (e.g., `preferences.weight`) based on the input's `name` attribute.
 * - `handleSubmit(e)`: An asynchronous function triggered on form submission. It calls the `updateUserProfile` service
 *   to save the changes to the backend and provides the user with feedback on the outcome.
 */
// src/pages/Authorization/MyDataPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyProfile, updateUserProfile } from '../../services/ProfileService';
import Navbar from '../../components/Navbar';
import './MyDataPage.css';

function MyDataPage() {
    // We use formState to hold the data for the entire form
    const [formState, setFormState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { data, error: fetchError } = await getMyProfile();
            if (fetchError) {
                setError(fetchError.message);
                setFormState(null);
            } else {
                // Pre-fill the form with the fetched data
                setFormState(data);
            }
            setLoading(false);
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [section, field] = name.split('.');

        if (field) {
            // Handle nested objects like 'preferences.weight'
            setFormState(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            // Handle top-level fields like 'firstName'
            setFormState(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const { data, error: updateError } = await updateUserProfile(formState);

        if (updateError) {
            setError(updateError.message);
        } else {
            setSuccess('Gegevens succesvol bijgewerkt!');
            // Optionally, refresh the form state with the latest data from the server
            setFormState(data);
            setTimeout(() => setSuccess(''), 3000); // Hide success message after 3 seconds
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="my-data-page"><p>Gegevens worden geladen...</p></div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="my-data-page form-message error"><p>Fout: {error}</p></div>
            </>
        );
    }

    if (!formState) {
        return (
            <>
                <Navbar />
                <div className="my-data-page"><p>Geen profielgegevens gevonden.</p></div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="my-data-page">
                <form className="form-card" onSubmit={handleSubmit}>
                    <h1>Mijn Gegevens Aanpassen</h1>

                    <div className="form-section">
                        <h2>Persoonlijke Gegevens</h2>
                        <div className="input-group">
                            <label htmlFor="firstName">Voornaam</label>
                            <input type="text" id="firstName" name="firstName" value={formState.firstName || ''} onChange={handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="lastName">Achternaam</label>
                            <input type="text" id="lastName" name="lastName" value={formState.lastName || ''} onChange={handleInputChange} />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">E-mailadres (kan niet gewijzigd worden)</label>
                            <input type="email" id="email" name="email" value={formState.email || ''} readOnly disabled />
                        </div>
                        <div className="input-group">
                            <label htmlFor="dob">Geboortedatum</label>
                            <input type="date" id="dob" name="dob" value={formState.dob ? formState.dob.split('T')[0] : ''} onChange={handleInputChange} />
                        </div>
                    </div>

                    {formState.preferences && (
                        <div className="form-section">
                            <h2>Voorkeuren</h2>
                            <div className="input-group">
                                <label htmlFor="preferences.gender">Geslacht</label>
                                <select id="preferences.gender" name="preferences.gender" value={formState.preferences.gender || ''} onChange={handleInputChange}>
                                    <option value="">Niet opgegeven</option>
                                    <option value="Man">Man</option>
                                    <option value="Vrouw">Vrouw</option>
                                    <option value="Anders">Anders</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="preferences.weight">Gewicht (kg)</label>
                                <input type="number" id="preferences.weight" name="preferences.weight" value={formState.preferences.weight || ''} onChange={handleInputChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="preferences.height">Lengte (cm)</label>
                                <input type="number" id="preferences.height" name="preferences.height" value={formState.preferences.height || ''} onChange={handleInputChange} />
                            </div>
                        </div>
                    )}

                    {formState.medicineInfo && (
                        <div className="form-section">
                            <h2>Medische Informatie</h2>
                            <div className="input-group">
                                <label htmlFor="medicineInfo.diabetesType">Type Diabetes</label>
                                <select id="medicineInfo.diabetesType" name="medicineInfo.diabetesType" value={formState.medicineInfo.diabetesType || ''} onChange={handleInputChange}>
                                    <option value="">Niet opgegeven</option>
                                    <option value="Type 1">Type 1</option>
                                    <option value="Type 2">Type 2</option>
                                    <option value="LADA">LADA</option>
                                    <option value="MODY">MODY</option>
                                    <option value="Zwangerschap">Zwangerschapsdiabetes</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="medicineInfo.longActingInsulin">Langwerkende Insuline</label>
                                <input type="text" id="medicineInfo.longActingInsulin" name="medicineInfo.longActingInsulin" value={formState.medicineInfo.longActingInsulin || ''} onChange={handleInputChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="medicineInfo.shortActingInsulin">Kortwerkende Insuline</label>
                                <input type="text" id="medicineInfo.shortActingInsulin" name="medicineInfo.shortActingInsulin" value={formState.medicineInfo.shortActingInsulin || ''} onChange={handleInputChange} />
                            </div>
                        </div>
                    )}

                    {success && <p className="form-message success">{success}</p>}
                    {error && <p className="form-message error">{error}</p>}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Bezig met opslaan...' : 'Gegevens Opslaan'}
                    </button>
                </form>
            </div>
        </>
    );
}

export default MyDataPage;