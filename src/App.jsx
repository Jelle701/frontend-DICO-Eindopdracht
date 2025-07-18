// src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Publieke Pagina's (toegankelijk voor iedereen)
import HomePage from './pages/open/HomePage.jsx';
import LoginPage from './pages/open/LoginPage.jsx';
import RegisterPage from './pages/open/register/RegisterPage.jsx';
import VerifyEmailPage from './pages/open/register/VerifyEmailPage.jsx';

// Beveiligde Pagina's (vereisen login)
import DashboardPage from './pages/Authorization/DashboardPage.jsx';
import GlucosePage from './pages/Authorization/GlucosePage.jsx';

// Beveiligde Onboarding Pagina's
import RegisterDetailsPage from './pages/open/register/RegisterPage2.jsx';
import OnboardingPreferences from './pages/open/register/RegisterPage3.jsx';
import MedicineInfo from './pages/open/register/MedicineInfo.jsx';
import DiabeticDevices from './pages/open/register/DiabeticDevices.jsx';

// Route Beveiligingscomponenten
import PrivateRoute from './components/PrivateRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';

function App() {
    return (
        <Routes>
            {/* --- Publieke Routes (Alleen als NIET ingelogd) --- */}
            <Route path="/" element={<HomePage />} />

            <Route path="/login" element={
                <PublicRoute>
                    <LoginPage />
                </PublicRoute>
            } />

            <Route path="/register" element={
                <PublicRoute>
                    <RegisterPage />
                </PublicRoute>
            } />

            <Route path="/verify" element={
                <PublicRoute>
                    <VerifyEmailPage />
                </PublicRoute>
            } />


            {/* --- Beveiligde Routes (Alleen als WEL ingelogd) --- */}
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <DashboardPage />
                </PrivateRoute>
            } />

            <Route path="/glucose/:id" element={
                <PrivateRoute>
                    <GlucosePage />
                </PrivateRoute>
            } />

            {/* De volledige onboarding-flow is beveiligd. */}
            <Route path="/register-details" element={
                <PrivateRoute>
                    <RegisterDetailsPage />
                </PrivateRoute>
            } />

            <Route path="/onboarding" element={
                <PrivateRoute>
                    <OnboardingPreferences />
                </PrivateRoute>
            } />

            <Route path="/medicine-info" element={
                <PrivateRoute>
                    <MedicineInfo />
                </PrivateRoute>
            } />

            <Route path="/devices" element={
                <PrivateRoute>
                    <DiabeticDevices />
                </PrivateRoute>
            } />


            {/* --- Fallback Route --- */}
            {/* Vang alle onbekende URLs op en stuur de gebruiker terug naar de homepage */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;