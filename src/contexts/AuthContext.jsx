// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMyProfile } from '../services/ProfileService.jsx'; // FIX: Correct import name

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                setIsAuth(true);
                // Fetch user profile when the app loads and a token exists
                const { data, error } = await getMyProfile();
                if (error) {
                    console.error("Failed to fetch user on initial load, logging out.", error);
                    // If the token is invalid, clear it and log out
                    localStorage.removeItem('token');
                    setToken(null);
                    setIsAuth(false);
                } else {
                    setUser(data);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, [token]); // This effect runs only when the token changes

    const login = (jwtResponse) => {
        // De login-functie accepteert nu het volledige object van de API.
        // Dit voorkomt een extra API-call om de gebruiker op te halen.
        const { token: responseToken, ...userData } = jwtResponse;

        localStorage.setItem('token', responseToken);
        setToken(responseToken);
        setIsAuth(true);

        // We hebben de gebruikersdata al, dus we kunnen deze direct instellen.
        // De 'user' state wordt bijgewerkt met de data van de login-response.
        // Aanname: de login response bevat nog geen 'flags'. Die komen pas na het ophalen van het volledige profiel.
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuth(false);
    };

    const contextValue = {
        token,
        isAuth,
        user,
        loading,
        login,
        logout,
        setUser, // Expose setUser for updates after onboarding
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook for components that only need authentication status
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return {
        isAuth: context.isAuth,
        loading: context.loading,
        login: context.login,
        logout: context.logout,
    };
};

// Custom hook for components that need the full user object
export const useUser = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useUser must be used within an AuthContextProvider');
    }
    return {
        user: context.user,
        setUser: context.setUser,
        loading: context.loading,
    };
};