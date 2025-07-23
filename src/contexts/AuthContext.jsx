import React, { createContext, useState, useEffect, useContext } from "react";
import ApiClient from "../services/ApiClient";
import { fetchUserProfile as _fetchUserProfile } from "../services/ProfileService";

// Named export van de context
export const AuthContext = createContext();

// Provider wrapper voor auth-state
export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            ApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            _fetchUserProfile()
                .then(profile => {
                    setUser(profile);
                    setIsAuth(true);
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    delete ApiClient.defaults.headers.common["Authorization"];
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    async function login(token) {
        localStorage.setItem("token", token);
        ApiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setLoading(true);
        try {
            const profile = await _fetchUserProfile();
            setUser(profile);
            setIsAuth(true);
        } catch (err) {
            console.error("Login error:", err);
            logout();
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        localStorage.removeItem("token");
        delete ApiClient.defaults.headers.common["Authorization"];
        setUser(null);
        setIsAuth(false);
    }

    return (
        <AuthContext.Provider value={{ user, isAuth, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook om auth-context te gebruiken
export function useAuth() {
    return useContext(AuthContext);
}
