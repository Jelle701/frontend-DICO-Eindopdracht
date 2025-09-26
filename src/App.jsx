// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

// Component Imports
import PublicRoute from "./components/PublicRoute.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

// --- Page Imports (Lazily Loaded) ---
const HomePage = lazy(() => import('./pages/open/HomePage.jsx'));
const LoginPage = lazy(() => import('./pages/open/LoginPage.jsx'));
const DashboardPage = lazy(() => import('./pages/Authorization/DashboardPage.jsx'));
const MyDataPage = lazy(() => import('./pages/Authorization/MyDataPage.jsx'));
const GlucoseLogPage = lazy(() => import('./pages/Authorization/GlucoseLogPage.jsx'));
const ServiceHubPage = lazy(() => import('./pages/service/ServiceHubPage.jsx'));

// Onboarding Pages
const RegisterPage = lazy(() => import('./pages/open/onboarding/RegisterPage.jsx'));
const VerifyEmailPage = lazy(() => import('./pages/open/onboarding/VerifyEmailPage.jsx'));
const SelectRolePage = lazy(() => import('./pages/open/onboarding/SelectRolePage.jsx'));
const OnboardingPreferences = lazy(() => import('./pages/open/onboarding/OnboardingPreferences.jsx'));
const MedicineInfo = lazy(() => import('./pages/open/onboarding/MedicineInfo.jsx'));
const DiabeticDevices = lazy(() => import('./pages/open/onboarding/DiabeticDevices.jsx'));
const OnboardingLinkPatientPage = lazy(() => import('./pages/open/onboarding/OnboardingLinkPatientPage.jsx'));

// Zorgverlener Pages
const PatientPortal = lazy(() => import('./pages/Zorgverlener/PatientPortal.jsx'));
const ProviderDashboard = lazy(() => import('./pages/Zorgverlener/ProviderDashboard.jsx')); // NIEUW

const LoadingFallback = () => <div style={{ textAlign: 'center', marginTop: '50px' }}>Laden...</div>;

function App() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/verify" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />

                {/* --- Private Routes (require authentication) --- */}
                <Route element={<PrivateRoute />}>
                    {/* Redirect for a legacy route */}
                    <Route path="/register-details" element={<Navigate to="/onboarding/role" replace />} />

                    {/* Onboarding Flow */}
                    <Route path="/onboarding/role" element={<SelectRolePage />} />
                    <Route path="/onboarding/preferences" element={<OnboardingPreferences />} />
                    <Route path="/onboarding/medicine" element={<MedicineInfo />} />
                    <Route path="/onboarding/devices" element={<DiabeticDevices />} />
                    <Route path="/onboarding/link-patient" element={<OnboardingLinkPatientPage />} />

                    {/* Core Application */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/glucose-log" element={<GlucoseLogPage />} />
                    <Route path="/my-data" element={<MyDataPage />} />
                    <Route path="/service-hub" element={<ServiceHubPage />} />
                    
                    {/* Zorgverlener Routes */}
                    <Route path="/patient-portal" element={<PatientPortal />} />
                    <Route path="/provider-dashboard" element={<ProviderDashboard />} /> {/* NIEUW */}
                </Route>

                {/* --- Catch-all Route --- */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}

export default App;
