// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Importeer de applicatie en de context providers
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx'; // Gebruik de hernoemde en verbeterde AuthProvider

// Importeer de hoofd-stylesheet
import './index.css';

// Render de applicatie in de DOM
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/*
          VERBETERING: BrowserRouter is nu de buitenste wrapper.
          Dit zorgt ervoor dat alle routing-functionaliteiten overal in de app beschikbaar zijn.
        */}
        <BrowserRouter>
            {/*
              UserProvider levert de basisgebruikersdata en login/logout-functies.
            */}
            <UserProvider>
                {/*
                  AuthProvider gebruikt de data van UserProvider en moet dus daarbinnen genest zijn.
                */}
                <AuthProvider>
                    {/*
                      ThemeProvider kan overal staan, maar hier is het logisch
                      omdat het de themagegevens voor de hele App levert.
                    */}
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </AuthProvider>
            </UserProvider>
        </BrowserRouter>
    </React.StrictMode>
);