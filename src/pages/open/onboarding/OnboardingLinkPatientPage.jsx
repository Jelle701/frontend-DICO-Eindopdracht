import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/ApiClient';
import Navbar from '../../../components/Navbar.jsx';
import './RegisterPage.css'; // AANGEPAST: Gebruik nu de juiste CSS

function OnboardingLinkPatientPage() {
    const [formData, setFormData] = useState({
        email: '',
        code: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.email || !formData.code) {
            setError('Voer zowel het e-mailadres als de toegangscode in.');
            setLoading(false);
            return;
        }

        try {
            const response = await apiClient.post('/api/access/grant', { 
                email: formData.email, 
                accessCode: formData.code 
            });
            const { delegatedToken, patientUsername } = response.data;

            if (delegatedToken) {
                sessionStorage.setItem('delegatedToken', delegatedToken);
                if (patientUsername) {
                    sessionStorage.setItem('patientUsername', patientUsername);
                }
                navigate('/dashboard');
            } else {
                setError('Geen geldig token ontvangen van de server.');
            }

        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('De combinatie van e-mailadres en toegangscode is ongeldig of verlopen.');
            } else {
                setError('Er is een fout opgetreden. Probeer het later opnieuw.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="onboarding-page-container">
                <div className="auth-page">
                    <form onSubmit={handleSubmit}>
                        <h1>Koppel aan Patiënt</h1>
                        <p>Voer het e-mailadres en de toegangscode in die u van de patiënt heeft ontvangen om het dashboard te bekijken.</p>
                        
                        <div className="input-group">
                            <label htmlFor="email">E-mailadres van Patiënt</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="bv. patient@email.com"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="code">Toegangscode</label>
                            <input
                                id="code"
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="bv. A7B-X9C-F4G"
                                required
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" disabled={loading} className="btn btn--primary form-action-button">
                            {loading ? 'Bezig met verbinden...' : 'Bekijk Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default OnboardingLinkPatientPage;
