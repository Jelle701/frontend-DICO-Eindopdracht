// src/context/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/ApiClient';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize from stored token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    async function login({ email, password }) {
        const { data } = await apiClient.post('/auth/login', { email, password });
        const token = data.token;
        localStorage.setItem('token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchProfile();
    }

    function logout() {
        localStorage.removeItem('token');
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
    }

    async function fetchProfile() {
        try {
            const { data } = await apiClient.get('/users/profile');
            setUser(data);
        } catch (error) {
            console.error('Profile fetch failed', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    return (
        <UserContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
