// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMyProfile } from '../services/ProfileService.jsx';

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                const { data, error } = await getMyProfile();
                if (error) {
                    console.error("Token is invalid, logging out.", error);
                    logout();
                } else {
                    setUser(data);
                    setIsAuth(true);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, [token]);

    const login = async (jwt, navigate) => {
        localStorage.setItem('token', jwt);
        setToken(jwt);
        setIsAuth(true);

        const { data: profile, error } = await getMyProfile();

        if (error) {
            console.error("Failed to fetch profile after login:", error);
            logout();
            navigate('/login?error=profile_fetch_failed');
            return;
        }

        setUser(profile);

        // De nieuwe, intelligente navigatielogica.
        if (profile && profile.role) {
            // Als de gebruiker een rol heeft, stuur naar de juiste pagina.
            switch (profile.role) {
                case 'PATIENT':
                    navigate('/dashboard');
                    break;
                case 'GUARDIAN':
                    // TODO: Moet naar een specifieke guardian-pagina.
                    navigate('/dashboard'); // Tijdelijk
                    break;
                case 'PROVIDER':
                    navigate('/patient-management');
                    break;
                default:
                    navigate('/login'); // Fallback
            }
        } else {
            // Als de gebruiker nog geen rol heeft, stuur naar de rol-selectie pagina.
            navigate('/register-details');
        }
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
        setUser,
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