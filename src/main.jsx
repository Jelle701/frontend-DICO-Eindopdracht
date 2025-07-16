import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import './index.css';
import {ThemeProvider} from "./services/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <ThemeProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
                </ThemeProvider>
        </UserProvider>
    </React.StrictMode>
);