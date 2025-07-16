import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/open/LoginPage.jsx';
import RegisterPage from './pages/open/register/RegisterPage.jsx';
import VerifyEmailPage from './pages/open/register/VerifyEmailPage.jsx';
import RegisterDetailsPage from './pages/open/register/RegisterPage2.jsx';
import OnboardingPreferences from './pages/open/register/RegisterPage3.jsx';
import HomePage from './pages/open/HomePage.jsx';

import DashboardPage from './pages/Authorization/DashboardPage.jsx';
import GlucosePage from './pages/Authorization/GlucosePage.jsx';

import PrivateRoute from './components/PrivateRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';

import MedicineInfo from './pages/open/register/MedicineInfo.jsx';
import DiabeticDevices from './pages/open/register/DiabeticDevices.jsx';

function App() {
    return (
        <Routes>
            {/* Open homepage */}
            <Route path="/" element={<HomePage />} />

            {/* Auth: alleen als NIET ingelogd */}
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

            <Route path="/register-details" element={
                <PublicRoute>
                    <RegisterDetailsPage />
                </PublicRoute>
            } />

            <Route path="/onboarding" element={
                <PublicRoute>
                    <OnboardingPreferences />
                </PublicRoute>
            } />

            {/* Beveiligde pagina's: alleen als ingelogd */}
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
            <Route path="/medicine-info" element={
                <PublicRoute>
                    <MedicineInfo />
                </PublicRoute>
            } />

            <Route path="/devices" element={
                <PublicRoute>
                    <DiabeticDevices />
                </PublicRoute>
            } />

            {/* Alles wat niet bestaat terug naar home */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
