import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from 'src/contexts/UserContext.jsx';
import Navbar from '../../../components/Navbar.jsx';
import './RegisterPage.css';

/**
 * Pagina voor het aanmaken van een nieuw account.
 *
 * Verzamelt gebruikersgegevens, valideert invoer,
 * roept de registratie-logica aan en navigeert na succes.
 */
function RegisterPage() {
    const { register } = useUser();
    const navigate = useNavigate();

    // Formuliervelden
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    /**
     * Verwerkt inputveranderingen.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'firstName': setFirstName(value); break;
            case 'lastName': setLastName(value); break;
            case 'dob': setDob(value); break;
            case 'email': setEmail(value); break;
            case 'password': setPassword(value); break;
            case 'confirmPassword': setConfirmPassword(value); break;
            default: break;
        }
    };

    /**
     * Verstuurt het registratieformulier.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Wachtwoorden komen niet overeen.');
            return;
        }

        try {
            await register({ firstName, lastName, dob, email, password });
            navigate('/verify');
        } catch (err) {
            setError(err.message || 'Registratie mislukt, probeer opnieuw.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page container">
                <h1 className="text-center">Account aanmaken</h1>
                <form onSubmit={handleSubmit} className="form flex flex-col gap-4">
                    <div className="form-group">
                        <label htmlFor="firstName">Voornaam</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={firstName}
                            onChange={handleChange}
                            placeholder="Vul je voornaam in"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Achternaam</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={lastName}
                            onChange={handleChange}
                            placeholder="Vul je achternaam in"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dob">Geboortedatum</label>
                        <input
                            id="dob"
                            name="dob"
                            type="date"
                            value={dob}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-mailadres</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="Vul je e-mailadres in"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Wachtwoord</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={handleChange}
                            placeholder="Kies een wachtwoord"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Herhaal wachtwoord</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={handleChange}
                            placeholder="Herhaal je wachtwoord"
                            required
                        />
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="btn btn-primary">
                        Registreer
                    </button>
                </form>
            </div>
        </>
    );
}

export default RegisterPage;