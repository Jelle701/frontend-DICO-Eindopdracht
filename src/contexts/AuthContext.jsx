import React, { createContext, useContext, useEffect } from 'react';
import { useUser } from './UserContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            const from = location.state?.from?.pathname || '/login';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
