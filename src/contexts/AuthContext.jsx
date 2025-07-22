// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from 'src/services/ApiClient'; // Gebruik je apiClient

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true); // Belangrijk voor initiële check

    // Check of er al een sessie is bij het laden van de app
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                // Probeer een beveiligd endpoint aan te roepen (bv. user profiel)
                const { data } = await apiClient.get('/profile');
                setUser(data);
                setIsAuth(true);
            } catch (error) {
                setUser(null);
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };
        checkLoginStatus();
    }, []);

    const login = async (credentials) => {
        const { data } = await apiClient.post('/login', credentials); // API call
        setUser(data.user);
        setIsAuth(true);
        // Token wordt idealiter in een httpOnly cookie gezet door de backend
    };

    const logout = () => {
        apiClient.post('/logout'); // API call
        setUser(null);
        setIsAuth(false);
    };

    const value = { user, isAuth, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook blijft hetzelfde
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth moet binnen een AuthProvider gebruikt worden');
    }
    return context;
}