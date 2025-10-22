import React, { createContext, useState, useContext, useEffect } from 'react';

const LibreViewContext = createContext(null);

export function LibreViewContextProvider({ children }) {
    const [session, setSession] = useState(() => {
        try {
            const storedSession = sessionStorage.getItem('libreview_session');
            return storedSession ? JSON.parse(storedSession) : null;
        } catch (error) {
            return null;
        }
    });

    useEffect(() => {
        if (session) {
            sessionStorage.setItem('libreview_session', JSON.stringify(session));
        } else {
            sessionStorage.removeItem('libreview_session');
        }
    }, [session]);

    const login = (sessionData) => {
        setSession(sessionData);
    };

    const logout = () => {
        setSession(null);
    };

    const value = {
        session,
        isLoggedIn: !!session,
        login,
        logout,
    };

    return (
        <LibreViewContext.Provider value={value}>
            {children}
        </LibreViewContext.Provider>
    );
}

export const useLibreView = () => {
    const context = useContext(LibreViewContext);
    if (!context) {
        throw new Error('useLibreView must be used within a LibreViewContextProvider');
    }
    return context;
};
