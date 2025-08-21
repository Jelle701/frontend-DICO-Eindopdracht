// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

// Route Guard Components (these are small and can be loaded eagerly)
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

// Lazily load all page components
const HomePage = lazy(() => import('./pages/open/HomePage'));
const LoginPage = lazy(() => import('./pages/open/LoginPage'));
const DashboardPage = lazy(() => import('./pages/Authorization/DashboardPage'));
const MyDataPage = lazy(() => import('./pages/Authorization/MyDataPage.jsx'));
const GlucoseLogPage = lazy(() => import('./pages/Authorization/GlucoseLogPage.jsx'));
const ServiceHubPage = lazy(() => import('./pages/service/ServiceHubPage.jsx'));
const AccessCodeManagementPage = lazy(() => import('./pages/Authorization/AccessCodeManagementPage'));
const GrantAccessPage = lazy(() => import('./pages/open/GrantAccessPage'));
const LinkPatientPage = lazy(() => import('./pages/open/LinkPatientPage'));
const PatientManagementPage = lazy(() => import('./pages/Authorization/PatientManagementPage')); // Nieuwe pagina voor Zorgverlener

// Onboarding Page Components
const RegisterPage = lazy(() => import('./pages/open/onboarding/RegisterPage'));
const VerifyEmailPage = lazy(() => import('./pages/open/onboarding/VerifyEmailPage'));
const SelectRolePage = lazy(() => import('./pages/open/onboarding/SelectRolePage'));
const OnboardingPreferences = lazy(() => import('./pages/open/onboarding/OnboardingPreferences'));
const MedicineInfo = lazy(() => import('./pages/open/onboarding/MedicineInfo'));
const DiabeticDevices = lazy(() => import('./pages/open/onboarding/DiabeticDevices'));

// A simple fallback component to show while pages are loading
const LoadingFallback = () => <div style={{ textAlign: 'center', marginTop: '50px' }}>Laden...</div>;

function App() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Publieke Routes: Toegankelijk voor iedereen */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                <Route path="/verify" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
                <Route path="/grant-access" element={<PublicRoute><GrantAccessPage /></PublicRoute>} />

                {/*
                  Beveiligde Routes: Vereisen authenticatie.
                */}
                <Route element={<PrivateRoute />}>
                    {/* Onboarding Flow Routes */}
                    <Route path="/register-details" element={<SelectRolePage />} />
                    <Route path="/onboarding" element={<OnboardingPreferences />} />
                    <Route path="/medicine-info" element={<MedicineInfo />} />
                    <Route path="/devices" element={<DiabeticDevices />} />
                    <Route path="/link-patient" element={<LinkPatientPage />} />

                    {/* Main Application Routes (na onboarding) */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/glucose-log" element={<GlucoseLogPage />} />
                    <Route path="/my-data" element={<MyDataPage />} />
                    <Route path="/service-hub" element={<ServiceHubPage />} />
                    <Route path="/access-code-management" element={<AccessCodeManagementPage />} />
                    <Route path="/patient-management" element={<PatientManagementPage />} /> {/* Nieuwe route */}
                </Route>

                {/* Fallback Route: Vangt alle niet-gedefinieerde paden op en stuurt door naar de homepage */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}

export default App;
