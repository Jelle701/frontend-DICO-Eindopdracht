import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext.jsx';
import '../../App.css';
import Navbar from "../../components/Navbar.jsx";
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useUser();
    const navigate = useNavigate();
    const handleSubmit = (e) => { e.preventDefault(); login({ email, password }); navigate('/dashboard'); };
    return (
        <>
            <Navbar/>
            <div className="auth-page container">
                <h1 className="text-center">Inloggen</h1>
                <form onSubmit={handleSubmit} className="flex flex-center flex-col gap-1">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                           placeholder="Wachtwoord"/>
                    <button type="submit" className="btn btn-primary mt-1">Log in</button>
                </form>
            </div>
        </>
    );
}
export default LoginPage;