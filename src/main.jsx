// src/main.jsx

// sentry is a tracking tool - in development
// import "./sentry";

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthContextProvider } from './contexts/AuthContext.jsx';
import { OnboardingContextProvider } from './contexts/OnboardingContext.jsx';
import { LibreViewContextProvider } from './contexts/LibreViewContext.jsx';
import './index.css';



ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <OnboardingContextProvider>
                    <LibreViewContextProvider> {/* Voeg de provider toe */} 
                        <App />
                    </LibreViewContextProvider>
                </OnboardingContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);
