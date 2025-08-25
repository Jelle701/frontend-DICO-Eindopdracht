/**
 * @file LinkPatientPage.jsx
 * @description This page is designed for a logged-in guardian or caregiver to link their account to a patient's
 * account. By entering the unique access code provided by the patient, a permanent link is established, allowing the
 * guardian to view the patient's data through their own dashboard.
 *
 * @component
 * @returns {JSX.Element} The rendered component for linking a patient.
 *
 * @functions
 * - `LinkPatientPage()`: The main functional component that renders the form and manages its state (code, error, loading).
 * - `handleSubmit(e)`: Triggered on form submission. It calls the `linkPatientByCode` service to validate the code
 *   and establish the account link on the backend. On success, it navigates the guardian to their dashboard. It displays
 *   an error message if the linking process fails.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { linkPatientByCode } from '../../services/GuardianService'; // Importeer de nieuwe service
import './GrantAccessPage.css'; // We hergebruiken de styling

// Deze pagina is voor een ingelogde Ouder/Voogd om hun account te koppelen aan een patiënt.
function LinkPatientPage() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!code) {
            setError('Voer de toegangscode van de patiënt in.');
            setLoading(false);
            return;
        }

        try {
            // Roep de nieuwe service aan om de koppeling te maken.
            const { data, error: apiError } = await linkPatientByCode(code);

            if (apiError) {
                throw apiError;
            }

            // Na een succesvolle koppeling, stuur de ouder naar het dashboard.
            // De backend weet nu dat deze ouder toegang heeft tot de data van de patiënt.
            navigate('/dashboard');

        } catch (err) {
            setError(err.message || 'Er is een onbekende fout opgetreden.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grant-access-container">
            <form onSubmit={handleSubmit} className="grant-access-form">
                <h2>Koppel aan Patiënt</h2>
                <p>Voer de unieke toegangscode in die u van de patiënt heeft ontvangen om de accounts te koppelen.</p>
                
                <div className="form-group">
                    <label htmlFor="access-code">Toegangscode van Patiënt</label>
                    <input
                        id="access-code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="bv. A7B-X9C-F4G"
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Bezig met koppelen...' : 'Koppel Account'}
                </button>
            </form>
        </div>
    );
}

export default LinkPatientPage;
