import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { getMyProfile } from '../services/ProfileService.jsx';

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null); // Initialiseer naar null
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true); // Initial loading state

    // NIEUW: Log state changes in AuthContextProvider
    useEffect(() => {
        console.log('AuthContextProvider: user changed to', user);
    }, [user]);

    useEffect(() => {
        console.log('AuthContextProvider: loading changed to', loading);
    }, [loading]);

    useEffect(() => {
        console.log('AuthContextProvider: isAuth changed to', isAuth);
    }, [isAuth]);

    const logout = useCallback(() => {
        console.log('AuthContextProvider: Performing logout.');
        localStorage.removeItem('token');
        sessionStorage.removeItem('delegatedToken');
        sessionStorage.removeItem('patientUsername');
        setToken(null);
        setUser(null);
        setIsAuth(false);
        setLoading(false); // Ensure loading is false after logout
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            // DE FIX: Voorkom redundante initialisatie als user al is gezet en isAuth true is.
            // Dit voorkomt de race condition na setUserData.
            if (user && isAuth) {
                setLoading(false); // Zorg ervoor dat loading false is als we al geauthenticeerd zijn
                return; 
            }

            if (token) { // Only proceed if a token exists
                setLoading(true); // Set loading to true only when a token is present and we're fetching
                try {
                    console.log('AuthContextProvider: Calling getMyProfile...');
                    const { data, error } = await getMyProfile();
                    if (error) {
                        console.log('AuthContextProvider: getMyProfile error, logging out.');
                        logout(); // This will also set loading to false
                    } else {
                        console.log('AuthContextProvider: getMyProfile success, setting user to:', data);
                        setUser(data);
                        setIsAuth(true);
                    }
                } catch (err) {
                    console.error("AuthContextProvider: Error fetching profile during initialization:", err);
                    logout(); // Log out on error, which sets loading to false
                } finally {
                    // Ensure loading is false after the fetch operation
                    setLoading(false);
                }
            } else {
                // If no token, we are not authenticated and not loading
                console.log('AuthContextProvider: No token found, setting unauthenticated state.');
                setLoading(false);
                setIsAuth(false);
                setUser(null); // Ensure user is null if no token
            }
        };
        initializeAuth();
    }, [token, logout, user, isAuth]); // Added user, isAuth to dependencies

    const login = useCallback((jwt) => {
        console.log('AuthContextProvider: Login called, setting token.');
        localStorage.setItem('token', jwt);
        setToken(jwt);
    }, []);

    // Function to update user and loading state consistently from external calls (e.g., SelectRolePage)
    const setUserData = useCallback((profile) => {
        console.log('AuthContextProvider: setUserData called, setting user to:', profile);
        setUser(profile);
        setIsAuth(true); // If we set user, they are authenticated
        setLoading(false); // Ensure loading is false after setting user data
    }, []);

    const contextValue = useMemo(() => ({
        token,
        isAuth,
        user,
        loading,
        login,
        logout,
        setUserData, // Exporteer de nieuwe functie
    }), [token, isAuth, user, loading, login, logout, setUserData]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

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
        setUserData: context.setUserData, // Exporteer de nieuwe functie
        loading: context.loading,
    };
};