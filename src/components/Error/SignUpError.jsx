import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
// ... andere imports

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset de foutmelding bij elke nieuwe poging

        try {
            const response = await api.post('/users/register', {
                email: email,
                password: password
            });

            if (response.status === 200) {
                navigate('/signin');
            }
        } catch (e) {
            console.error(e);
            if (e.response) {
                // Vang de specifieke foutmelding van de backend op
                setError(e.response.data);
            } else {
                // Algemene foutmelding als de server niet bereikbaar is
                setError('Registratie mislukt. Probeer het later opnieuw.');
            }
        }
    };

    return (
        // ... je JSX
        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <p className="error-message">{error}</p>}

            <button type="submit">Registreren</button>
        </form>
        // ... rest van je JSX
    );
}

export default SignUp;