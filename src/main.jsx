import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import './index.css';
import {ThemeProvider} from "./contexts/ThemeContext.jsx";
import AuthContextProvider from "src/contexts/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <ThemeProvider>
            <BrowserRouter>
                <AuthContextProvider>
                    <App />
                </AuthContextProvider>
            </BrowserRouter>
                </ThemeProvider>
        </UserProvider>
    </React.StrictMode>
);