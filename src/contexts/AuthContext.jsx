import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import apiClient from 'src/services/ApiClient.jsx';

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
    const [auth, setAuth] = useState({
        isAuth: false,
        user: null,
        status: "pending",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 > Date.now()) {
                fetchUserData(token);
            } else {
                // Token is verlopen
                setAuth({ isAuth: false, user: null, status: 'done' });
            }
        } else {
            // Geen token gevonden
            setAuth({ isAuth: false, user: null, status: 'done' });
        }
    }, []);

    async function fetchUserData(token) {
        try {
            const response = await apiClient.get('/profile', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setAuth({
                isAuth: true,
                user: response.data,
                status: 'done',
            });
        } catch (e) {
            console.error("Ophalen van gebruikersdata mislukt", e);
            // Als ophalen mislukt, loggen we de gebruiker uit
            localStorage.removeItem('token');
            setAuth({ isAuth: false, user: null, status: 'done' });
        }
    }

    function login(jwt) {
        localStorage.setItem('token', jwt);
        const decodedToken = jwtDecode(jwt);
        // Na het opslaan van de token, haal de volledige user data op
        fetchUserData(jwt).then(() => {
            navigate('/dashboard');
        });
    }

    function logout() {
        localStorage.removeItem('token');
        setAuth({ isAuth: false, user: null, status: 'done' });
        navigate('/');
    }

    const contextData = {
        isAuth: auth.isAuth,
        user: auth.user,
        login: login,
        logout: logout,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {auth.status === 'pending'
                ? <p>Loading...</p>
                : children
            }
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;