// contexts/UserContext.jsx

import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = ({ email, password }) => {
        // Stub-login met test-credentials
        if (email === 'user@test.com' && password === 'Password123') {
            setUser({ id: '1', name: 'Test User', email });
            return true;
        } else {
            alert('Ongeldige inloggegevens');
            return false;
        }
    };

    const register = (details) => {
        // Hier kun je registratie logica toevoegen
        setUser({ id: '2', name: details.email, email: details.email });
    };

    const logout = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, login, register, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
