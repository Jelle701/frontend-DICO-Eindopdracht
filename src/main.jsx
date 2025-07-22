// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext'; // Alleen deze importeren!

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <ThemeProvider>
                <AuthProvider> {/* Enkel deze provider is nodig voor user/auth */}
                    <App />
                </AuthProvider>
            </ThemeProvider>
        </Router>
    </React.StrictMode>
);