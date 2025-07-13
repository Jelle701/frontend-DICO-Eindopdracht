import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext.jsx';
import '../../../App.css';
import './RegisterPage.css';


function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');

    const { register } = useUser();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Wachtwoorden komen niet overeen.');
            return;
        }

        register({ email, password, firstName, lastName, dob });
        navigate('/dashboard');
    };

    return (
        <div className="auth-page container">
            <h1 className="text-center">Account aanmaken</h1>
            <form onSubmit={handleSubmit} className="flex flex-center flex-col gap-1">
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Voornaam" required />
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Achternaam" required />
                <input type="date" value={dob} onChange={e => setDob(e.target.value)} placeholder="Geboortedatum" required />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Emailadres" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Wachtwoord" required />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Herhaal wachtwoord" required />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className="btn btn-secondary mt-1">Registreer</button>
            </form>
        </div>
    );
}

export default RegisterPage;
