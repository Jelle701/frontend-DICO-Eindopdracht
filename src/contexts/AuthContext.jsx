import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { getMyProfile } from '../services/ProfileService.jsx';

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('delegatedToken');
        sessionStorage.removeItem('patientUsername');
        setToken(null);
        setUser(null);
        setIsAuth(false);
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                const { data, error } = await getMyProfile();
                if (error) {
                    logout();
                } else {
                    setUser(data);
                    setIsAuth(true);
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, [token, logout]);

    const login = useCallback((jwt) => {
        localStorage.setItem('token', jwt);
        setToken(jwt);
    }, []);

    const contextValue = useMemo(() => ({
        token,
        isAuth,
        user,
        loading,
        login,
        logout,
        setUser,
    }), [token, isAuth, user, loading, login, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// DE FIX: Herstel de custom hooks naar hun oorspronkelijke, correcte staat.
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
