import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../services/AuthService/AuthService';
import Navbar from '../../components/Navbar.jsx'; // Importeer de Navbar
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Vul alsjeblieft zowel je e-mailadres als wachtwoord in.');
            return;
        }

        const loginData = {
            username: formData.email,
            password: formData.password
        };

        const { data, error: apiError } = await loginUser(loginData);

        if (apiError) {
            setError(apiError.message || 'Er is een onbekende fout opgetreden.');
        } else {
            await login(data.jwt, navigate);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <form onSubmit={handleSubmit}>
                    <h1>Inloggen</h1>
                    <div className="input-group">
                        <label htmlFor="email">E-mailadres</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Wachtwoord</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Login
                    </button>

                    <div className="form-footer">
                        <p>
                            Nog geen account? <Link to="/register">Registreer hier</Link>
                        </p>
                        <p className="divider">of</p>
                        <p>
                            Bent u een zorgverlener of ouder/voogd? <Link to="/grant-access">Voer hier een code in</Link>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
}

export default LoginPage;