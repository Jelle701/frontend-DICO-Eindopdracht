/**
 * @file ThemeContext.jsx
 * @description This context provides a simple theming solution for the application, allowing users to toggle
 * between a 'light' and 'dark' mode. The selected theme is persisted in localStorage and applied as a class
 * to the `<body>` element to enable CSS-based styling.
 *
 * @module ThemeContext
 */
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * The provider component for the theme. It manages the current theme state and provides a function to toggle it.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the provider.
 * @returns {JSX.Element} The ThemeContext.Provider component.
 */
export function ThemeProvider({ children }) {
    // Initialize state from localStorage or default to 'light'
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    /**
     * An effect that runs when the theme changes. It updates the class on the `<body>` element
     * to apply the new theme and saves the choice to localStorage.
     */
    useEffect(() => {
        document.body.className = ''; // Reset classes
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    /**
     * A function to toggle the theme between 'light' and 'dark'.
     */
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

/**
 * Custom hook to easily consume the ThemeContext in any component.
 * @returns {{theme: string, toggleTheme: Function}} An object containing the current theme and the function to toggle it.
 * @throws {Error} If used outside of a ThemeProvider.
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
