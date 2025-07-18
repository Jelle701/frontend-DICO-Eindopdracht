// src/App.jsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Publieke Pagina's
import HomePage from './pages/open/HomePage.jsx';
import LoginPage from './pages/open/LoginPage.jsx';
import RegisterPage from './pages/open/register/RegisterPage.jsx';
import VerifyEmailPage from './pages/open/register/VerifyEmailPage.jsx';

// Beveiligde Pagina's (Dashboard & Onboarding)
import DashboardPage from './pages/Authorization/DashboardPage.jsx';
import GlucosePage from './pages/Authorization/GlucosePage.jsx';
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
            {/* --- Publieke Routes --- */}
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


            {/* --- Beveiligde Routes (vereisen login) --- */}
            {/* Het dashboard is alleen voor ingelogde gebruikers */}
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

            {/*
              VERBETERING: De volgende stappen in de onboarding horen achter een PrivateRoute.
              Een gebruiker moet ingelogd zijn om zijn/haar profiel af te maken.
              Dit maakt het ook mogelijk om deze pagina's later opnieuw te bezoeken om gegevens aan te passen.
            */}
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