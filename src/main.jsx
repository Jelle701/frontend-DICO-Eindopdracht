/**
 * @file main.jsx
 * @description This is the main entry point for the entire React application. It is responsible for rendering the root
 * component (`App`) into the DOM and wrapping it with all necessary top-level providers to make global state and
 * functionalities available throughout the component tree.
 *
 * @rendering
 * The application is rendered into the DOM element with the ID 'root'.
 *
 * @providers
 * The `App` component is wrapped in the following providers, from outermost to innermost:
 * 1.  **React.StrictMode**: Activates additional checks and warnings for its descendants, helping to identify potential problems in the application during development.
 * 2.  **BrowserRouter**: Enables client-side routing for the entire application, allowing the use of `<Routes>`, `<Route>`, `<Link>`, etc.
 * 3.  **AuthContextProvider**: Provides global authentication state, such as the current user and authentication status, to all components.
 * 4.  **OnboardingContextProvider**: Manages the state for the multi-step new user onboarding process.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthContextProvider } from './contexts/AuthContext.jsx';
import { OnboardingContextProvider } from './contexts/OnboardingContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <OnboardingContextProvider>
                    <App />
                </OnboardingContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);