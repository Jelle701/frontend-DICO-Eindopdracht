import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
            const response = await axios.post('http://localhost:8000/api/access/grant', { accessCode: code });
            const { token } = response.data;

            if (token) {
                // We use sessionStorage so the token is cleared when the tab is closed
                sessionStorage.setItem('delegated_token', token);
                navigate('/dashboard'); // Redirect to the dashboard
            } else {
                setError('Geen geldig token ontvangen van de server.');
            }

        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('De ingevoerde toegangscode is ongeldig.');
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
                        placeholder="bv. ABC-123-XYZ"
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
