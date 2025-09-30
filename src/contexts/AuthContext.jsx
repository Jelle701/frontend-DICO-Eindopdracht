import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { getMyProfile } from '../services/ProfileService.jsx';

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true); // Start with loading true

    // Log state changes for debugging
    useEffect(() => {
        console.log('AuthContextProvider: user changed to', user);
    }, [user]);

    useEffect(() => {
        console.log('AuthContextProvider: loading changed to', loading);
    }, [loading]);

    useEffect(() => {
        console.log('AuthContextProvider: isAuth changed to', isAuth);
    }, [isAuth]);

    // Stable logout function
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

    // Main effect for handling authentication logic
    useEffect(() => {
        let isMounted = true; // Flag to prevent state updates on unmounted component
        console.log('AuthContextProvider: Auth effect is running. Token:', token);

        const initializeAuth = async () => {
            if (token) {
                if (isMounted) setLoading(true);
                try {
                    console.log('AuthContextProvider: Calling getMyProfile...');
                    const { data, error } = await getMyProfile();

                    if (!isMounted) {
                        console.log('AuthContextProvider: Component unmounted after getMyProfile, aborting state update.');
                        return; // Abort if component is unmounted
                    }

                    if (error) {
                        console.log('AuthContextProvider: getMyProfile error, logging out.', error);
                        logout();
                    } else {
                        console.log('AuthContextProvider: getMyProfile success, setting user to:', data);
                        setUser(data);
                        setIsAuth(true);
                    }
                } catch (err) {
                    if (isMounted) {
                        console.error("AuthContextProvider: Error fetching profile during initialization:", err);
                        logout();
                    }
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            } else {
                // No token, so we are not authenticated.
                console.log('AuthContextProvider: No token found, setting unauthenticated state.');
                setUser(null);
                setIsAuth(false);
                setLoading(false);
            }
        };

        initializeAuth();

        // Cleanup function
        return () => {
            console.log('AuthContextProvider: Auth effect cleanup.');
            isMounted = false;
        };
    }, [token, logout]); // Only depends on token and the stable logout function

    const login = useCallback((jwt) => {
        console.log('AuthContextProvider: Login called, setting token.');
        localStorage.setItem('token', jwt);
        setToken(jwt);
    }, []);

    const setUserData = useCallback((profile) => {
        console.log('AuthContextProvider: setUserData called, setting user to:', profile);
        setUser(profile);
        setIsAuth(true);
        setLoading(false);
    }, []);

    const contextValue = useMemo(() => ({
        token,
        isAuth,
        user,
        loading,
        login,
        logout,
        setUserData,
    }), [token, isAuth, user, loading, login, logout, setUserData]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Keep original hooks to avoid breaking other parts of the app
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
        setUserData: context.setUserData,
        loading: context.loading,
    };
};
