import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DevBypassValidation from '../../../components/devtools/BypassRequiredFields.jsx';

function VerifyEmailPage() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();

        // Simulatie: check of code 123456 is
        if (code === '123456') {
            navigate('/register-details');
        } else {
            setError('Verificatiecode is onjuist.');
        }
    };

    return (
        <div className="auth-page container">
            <DevBypassValidation active={true} /> {/* Bypass vereist veld */}

            <h1>Email verifiëren</h1>
            <form onSubmit={handleVerify}>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Verificatiecode"
                    required
                />
                {error && <p>{error}</p>}
                <button type="submit">Verifieer</button>
            </form>
        </div>
    );
}

export default VerifyEmailPage;
