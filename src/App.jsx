import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext.jsx';

import HomePage from './pages/open/HomePage.jsx';
import LoginPage from './pages/open/LoginPage.jsx';
import RegisterPage from './pages/open/onboarding/RegisterPage.jsx';
import VerifyEmailPage from './pages/open/onboarding/VerifyEmailPage.jsx';

import DashboardPage from './pages/Authorization/DashboardPage.jsx';
import GlucosePage from './pages/Authorization/GlucosePage.jsx';

import RegisterDetailsPage from './pages/open/onboarding/RegisterDetailsPage.jsx';
import OnboardingPreferences from './pages/open/onboarding/OnboardingPreferences.jsx';
import MedicineInfo from './pages/open/onboarding/MedicineInfo.jsx';
import DiabeticDevices from './pages/open/onboarding/DiabeticDevices.jsx';

function App() {
    const { isAuth } = useContext(AuthContext);

    return (
        <Routes>
            {/* Publieke Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={!isAuth ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuth ? <RegisterPage /> : <Navigate to="/dashboard" />} />
            <Route path="/verify" element={!isAuth ? <VerifyEmailPage /> : <Navigate to="/dashboard" />} />

            {/* Beveiligde Routes */}
            <Route path="/dashboard" element={isAuth ? <DashboardPage /> : <Navigate to="/login" />} />
            <Route path="/glucose/:id" element={isAuth ? <GlucosePage /> : <Navigate to="/login" />} />

            {/* Onboarding Routes (ook beveiligd) */}
            <Route path="/register-details" element={isAuth ? <RegisterDetailsPage /> : <Navigate to="/login" />} />
            <Route path="/onboarding" element={isAuth ? <OnboardingPreferences /> : <Navigate to="/login" />} />
            <Route path="/medicine-info" element={isAuth ? <MedicineInfo /> : <Navigate to="/login" />} />
            <Route path="/devices" element={isAuth ? <DiabeticDevices /> : <Navigate to="/login" />} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;