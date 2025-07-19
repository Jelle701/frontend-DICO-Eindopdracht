// src/contexts/UserContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/ApiClient';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Start op true
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const { data } = await apiClient.get('/users/profile');
            setUser(data);
        } catch (error) {
            // Als het profiel ophalen mislukt, is het token ongeldig. Log de gebruiker uit.
            setUser(null);
            localStorage.removeItem('token');
            delete apiClient.defaults.headers.common['Authorization'];
        }
    };

    // Effect dat alleen draait als de app voor het eerst laadt
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchProfile().finally(() => setLoading(false));
        } else {
            setLoading(false); // Geen token, dus we zijn klaar met laden.
        }
    }, []);

    const login = async (credentials) => {
        // Zet loading op true TIJDENS het inloggen
        setLoading(true);
        try {
            const response = await apiClient.post('/auth/login', credentials);
            const token = response.data.token;
            localStorage.setItem('token', token);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await fetchProfile();
        } finally {
            // Zet loading terug op false na de poging
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        delete apiClient.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const value = {
        user,
        isAuth: !!user,
        loading, // <-- DEZE WORDT NU DOORGEGEVEN
        login,
        logout,
    };

    // Render niets totdat de initiële authenticatiecheck is voltooid
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}