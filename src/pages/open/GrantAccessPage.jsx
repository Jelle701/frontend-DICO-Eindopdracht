import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/ApiClient'; // Import the central client
import './GrantAccessPage.css';

const GrantAccessPage = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!code) {
            setError('Voer een toegangscode in.');
            setLoading(false);
            return;
        }

        try {
            // Use the central apiClient for the request
            const response = await apiClient.post('/api/access/grant', { accessCode: code });
            const { delegatedToken, patientUsername } = response.data;

            if (delegatedToken) {
                // We use sessionStorage so the token is cleared when the tab is closed
                sessionStorage.setItem('delegatedToken', delegatedToken);
                if (patientUsername) {
                    sessionStorage.setItem('patientUsername', patientUsername);
                }
                navigate('/dashboard'); // Redirect to the dashboard
            } else {
                setError('Geen geldig token ontvangen van de server.');
            }

        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('De ingevoerde toegangscode is ongeldig of verlopen.');
            } else {
                setError('Er is een fout opgetreden. Probeer het later opnieuw.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grant-access-container">
            <form onSubmit={handleSubmit} className="grant-access-form">
                <h2>Toegang tot Dashboard</h2>
                <p>Voer de toegangscode in die u van de patiënt heeft ontvangen om het dashboard te bekijken.</p>
                
                <div className="form-group">
                    <label htmlFor="access-code">Toegangscode</label>
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
                    {loading ? 'Bezig met verbinden...' : 'Bekijk Dashboard'}
                </button>
            </form>
        </div>
    );
};

export default GrantAccessPage;
