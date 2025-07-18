// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

// 1. Maak de Context aan (niet exporteren, we gebruiken een hook)
const AuthContext = createContext(null);

// 2. Exporteer de Provider Component
export function AuthProvider({ children }) {
    // Hier zou je de logica voor login, logout, etc. plaatsen
    // Voor nu gebruiken we een simpele state
    const [user, setUser] = useState(null); // Voorbeeld: null als niet ingelogd

    const login = (userData) => {
        // Hier zou je de API aanroepen en de user-data instellen
        setUser(userData);
    };

    const logout = () => {
        // Hier zou je het token verwijderen en de user-state resetten
        setUser(null);
    };

    // De 'value' die alle consumers van de context kunnen gebruiken
    const value = {
        user,
        isLoggedIn: !!user, // Converteer user object naar een boolean
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Exporteer de Custom Hook. Dit is de aanbevolen manier om de context te gebruiken.
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth moet binnen een AuthProvider gebruikt worden');
    }
    return context;
}