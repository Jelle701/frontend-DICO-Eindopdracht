import React, { useState } from 'react';
// ... andere imports

function SignUp() {
    // ... andere useState hooks
    const [error, setError] = useState(''); // State voor de foutmelding

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
            {/* ... je input velden ... */}

            {/* Toon de foutmelding als die er is */}
            {error && <p className="error-message">{error}</p>}

            <button type="submit">Registreren</button>
        </form>
        // ... rest van je JSX
    );
}

export default SignUp;