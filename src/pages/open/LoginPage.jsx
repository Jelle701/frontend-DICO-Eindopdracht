import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext.jsx';

export default function LoginPage() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const { login }               = useUser();
    const navigate                = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // TODO: vervang dit met echte API-call/authenticatie
        login({ email });
        navigate('/'); // na succesvolle login doorsturen naar home
    };

    return (
        <div className="login-page">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label><br/>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Wachtwoord:</label><br/>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Inloggen</button>
            </form>
        </div>
    );
}
