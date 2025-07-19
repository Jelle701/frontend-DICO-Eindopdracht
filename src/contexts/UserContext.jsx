import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

/**
 * Provider component die de user-state beschikbaar maakt
 */
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    /**
     * Simpele login-functie; vervang met je eigen auth‑logica
     */
    const login = (userData) => {
        setUser(userData);
    };

    /**
     * Simpele logout-functie
     */
    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

/**
 * Custom hook voor makkelijk gebruik van de UserContext
 */
export function useUser() {
    return useContext(UserContext);
}

export default UserContext;
