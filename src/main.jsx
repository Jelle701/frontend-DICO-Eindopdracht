// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthContextProvider } from './contexts/AuthContext.jsx';
// FIX: De naam van de import moet overeenkomen met de export
import { OnboardingContextProvider } from './contexts/OnboardingContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                {/* FIX: Gebruik hier ook de juiste componentnaam */}
                <OnboardingContextProvider>
                    <App />
                </OnboardingContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);