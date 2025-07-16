// contexts/UserContext.jsx

import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = ({ email, password }) => {
        if (import.meta.env.DEV) {
            setUser({ id: 'dev', name: 'Dev User', email });
            return true;
        }

        if (email === 'user@test.com' && password === 'Password123') {
            setUser({ id: '1', name: 'Test User', email });
            return true;
        }

        alert('Ongeldige inloggegevens');
        return false;
    };


    const register = (details) => {
        // Bijv. alleen opslaan in localStorage of context-buffer
        localStorage.setItem('registrationData', JSON.stringify(details));
        // setUser(null); // niks doen
    };


    const logout = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, login, register, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
