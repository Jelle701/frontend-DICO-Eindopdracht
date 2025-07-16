import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'src/components/axios.jsx';

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
    const [authState, setAuthState] = useState({
        isAuth: false,
        user: null,
        status: 'pending',
    });
    const navigate = useNavigate();

    // Effect om te checken of er al een token is bij het laden van de app
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwt_decode(token);
            // Hier kun je een check toevoegen of de token niet verlopen is
            login(token);
        } else {
            setAuthState({
                isAuth: false,
                user: null,
                status: 'done',
            });
        }
    }, []);

    async function login(token) {
        localStorage.setItem('token', token);
        const decodedToken = jwt_decode(token);

        // Hier zou je een request kunnen doen om de volledige user data op te halen
        // Voor nu gebruiken we de data uit de token
        setAuthState({
            isAuth: true,
            user: {
                email: decodedToken.sub, // 'sub' is vaak de username/email in een JWT
                // rollen etc. kun je ook uit de token halen
            },
            status: 'done',
        });
        console.log("Gebruiker is ingelogd!");
        navigate('/profile'); // Stuur gebruiker naar profielpagina na inloggen
    }

    function logout() {
        localStorage.removeItem('token');
        setAuthState({
            isAuth: false,
            user: null,
            status: 'done',
        });
        console.log("Gebruiker is uitgelogd!");
        navigate('/');
    }

    const contextData = {
        isAuth: authState.isAuth,
        user: authState.user,
        login: login,
        logout: logout,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {authState.status === 'pending' ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;