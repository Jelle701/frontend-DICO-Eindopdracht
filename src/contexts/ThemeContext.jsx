// src/contexts/ThemeContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

// Maak de context aan. Deze hoeft niet geëxporteerd te worden.
const ThemeContext = createContext();

// De provider component die de state en logica bevat.
export function ThemeProvider({ children }) {
    // Haal het thema uit localStorage of gebruik 'light' als standaard
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    // Effect om de class op de <body> aan te passen en de keuze op te slaan
    useEffect(() => {
        document.body.className = ''; // Reset classes
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Functie om het thema te wisselen
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const value = {
        theme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// Dit is de custom hook die componenten zullen gebruiken.
// Het is de enige export die componenten nodig hebben om de context te gebruiken.
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme moet binnen een ThemeProvider gebruikt worden');
    }
    return context;
}