/**
 * @file AuthContext.jsx
 * @description This file defines the authentication context for the entire application. It is responsible for managing
 * the user's authentication state, including the JWT, user profile data, and loading status. It provides this state
 * and related functions (login, logout) to all components wrapped within its provider.
 *
 * @module AuthContext
 */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMyProfile } from '../services/ProfileService.jsx';

const AuthContext = createContext(null);

/**
 * The provider component that encapsulates all authentication logic and state.
 * It should wrap the main application component to make the auth context available globally.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the provider.
 * @returns {JSX.Element} The AuthContext.Provider component.
 */
export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    /**
     * Initializes the authentication state when the application loads or the token changes.
     * If a token exists in localStorage, it attempts to fetch the user's profile to validate the token.
     * If successful, the user is considered authenticated. If not, the user is logged out.
     */
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

    /**
     * Handles the user login process. It saves the JWT to localStorage, updates the state,
     * fetches the user's profile, and then intelligently navigates the user to the correct page
     * based on their role (e.g., dashboard for patients, patient management for providers) or to the
     * onboarding flow if their profile is incomplete.
     * @param {string} jwt - The JSON Web Token received from the login API.
     * @param {Function} navigate - The navigate function from react-router-dom.
     */
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

        if (profile && profile.role) {
            switch (profile.role) {
                case 'PATIENT':
                    navigate('/dashboard');
                    break;
                case 'GUARDIAN':
                    navigate('/guardian-dashboard');
                    break;
                case 'PROVIDER':
                    navigate('/patient-management');
                    break;
                default:
                    navigate('/login'); // Fallback
            }
        } else {
            // If the user has no role, they need to complete onboarding.
            navigate('/onboarding/role');
        }
    };

    /**
     * Logs the user out by clearing the token from localStorage and resetting the authentication state.
     */
    const logout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('delegatedToken'); // Also clear any delegated token
        sessionStorage.removeItem('patientUsername');
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
        setUser, // Expose setUser to allow profile updates from other parts of the app
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook for components that need access to authentication status and actions (login/logout).
 * This provides a clean way to consume the context without needing the full user object.
 * @returns {{isAuth: boolean, loading: boolean, login: Function, logout: Function}}
 */
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

/**
 * Custom hook for components that need access to the full user profile object.
 * @returns {{user: object|null, setUser: Function, loading: boolean}}
 */
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