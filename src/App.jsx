/**
 * @file App.jsx
 * @description This is the root component of the application, responsible for setting up the entire routing structure
 * using `react-router-dom`. It uses lazy loading with `React.lazy` and `Suspense` to improve initial load times by
 * only loading the code for a page when it's requested.
 *
 * @component
 * @returns {JSX.Element} The main application component with all defined routes.
 *
 * @routingStructure
 * The routing is divided into three main categories:
 * 1.  **Stand-alone Public Routes**: Pages like Login and Register that do not use the main application layout (e.g., no Navbar).
 * 2.  **Layout-wrapped Routes**: All other routes are nested within a `<Layout />` component, which provides a consistent
 *     UI shell, including the main Navbar.
 * 3.  **Route Protection**: Access to routes is controlled by two wrapper components:
 *     - `<PublicRoute>`: Ensures that pages like Login and Register are only accessible to unauthenticated users. If an
 *       authenticated user tries to access them, they are redirected to the dashboard.
 *     - `<PrivateRoute>`: Protects routes that should only be accessible to authenticated users. If an unauthenticated
 *       user tries to access them, they are redirected to the login page.
 *
 * @routePaths
 * The application follows these main paths:
 * - `/` (Public): The main landing page (`HomePage`).
 * - `/login`, `/register` (Public): User authentication pages.
 * - `/verify` (Public): Page for new users to verify their email address.
 * - `/grant-access` (Public): Allows a third party (e.g., caregiver) to enter an access code.
 * - `/dashboard` (Private): The main dashboard for the logged-in user.
 * - `/onboarding/...` (Private): A nested set of routes for the multi-step new user onboarding process (role selection, preferences, etc.).
 * - `/link-patient` (Private): A page for Guardians to link to a patient's account.
 * - `/patient-management` (Private): A dashboard for Healthcare Providers to manage their linked patients.
 * - Other private routes like `/glucose-log`, `/my-data`, `/service-hub`, and `/access-code-management` provide core application features.
 * - A wildcard route `*` catches any undefined URL and redirects the user to the homepage.
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

// Layout en Route Guard Components
import Layout from './components/Layout';
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

// Lazily load all page components for better performance
const HomePage = lazy(() => import('./pages/open/HomePage'));
const LoginPage = lazy(() => import('./pages/open/LoginPage'));
const DashboardPage = lazy(() => import('./pages/Authorization/DashboardPage'));
const MyDataPage = lazy(() => import('./pages/Authorization/MyDataPage.jsx'));
const GlucoseLogPage = lazy(() => import('./pages/Authorization/GlucoseLogPage.jsx'));
const ServiceHubPage = lazy(() => import('./pages/service/ServiceHubPage.jsx'));
const AccessCodeManagementPage = lazy(() => import('./pages/Authorization/AccessCodeManagementPage'));
const GrantAccessPage = lazy(() => import('./pages/open/GrantAccessPage'));
const LinkPatientPage = lazy(() => import('./pages/open/LinkPatientPage'));
const PatientManagementPage = lazy(() => import('./pages/Authorization/PatientManagementPage'));
const GuardianDashboardPage = lazy(() => import('./pages/Authorization/GuardianDashboardPage.jsx'));

// Onboarding Page Components
const RegisterPage = lazy(() => import('./pages/open/onboarding/RegisterPage'));
const VerifyEmailPage = lazy(() => import('./pages/open/onboarding/VerifyEmailPage'));
const SelectRolePage = lazy(() => import('./pages/open/onboarding/SelectRolePage'));
const OnboardingPreferences = lazy(() => import('./pages/open/onboarding/OnboardingPreferences'));
const MedicineInfo = lazy(() => import('./pages/open/onboarding/MedicineInfo'));
const DiabeticDevices = lazy(() => import('./pages/open/onboarding/DiabeticDevices'));

// A simple fallback component to show while lazily loaded pages are loading
const LoadingFallback = () => <div style={{ textAlign: 'center', marginTop: '50px' }}>Laden...</div>;

function App() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Stand-alone routes that DO NOT use the main Layout (e.g., no Navbar) */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

                {/* All routes below are wrapped in the main Layout, providing a consistent UI (e.g., with Navbar) */}
                <Route element={<Layout />}>
                    {/* --- Publicly Accessible Routes --- */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/verify" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />
                    <Route path="/grant-access" element={<PublicRoute><GrantAccessPage /></PublicRoute>} />

                    {/* --- Private Routes (require authentication) --- */}
                    <Route element={<PrivateRoute />}>
                        {/* Redirect for a legacy/old onboarding route to the new correct path */}
                        <Route path="/register-details" element={<Navigate to="/onboarding/role" replace />} />

                        {/* --- Nested Onboarding Flow for New Users --- */}
                        <Route path="/onboarding/role" element={<SelectRolePage />} />
                        <Route path="/onboarding/preferences" element={<OnboardingPreferences />} />
                        <Route path="/onboarding/medicine" element={<MedicineInfo />} />
                        <Route path="/onboarding/devices" element={<DiabeticDevices />} />

                        {/* --- Role-Specific Routes --- */}
                        <Route path="/link-patient" element={<LinkPatientPage />} />
                        <Route path="/patient-management" element={<PatientManagementPage />} />

                        {/* --- Core Application Routes for Authenticated Users --- */}
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/guardian-dashboard" element={<GuardianDashboardPage />} />
                        <Route path="/glucose-log" element={<GlucoseLogPage />} />
                        <Route path="/my-data" element={<MyDataPage />} />
                        <Route path="/service-hub" element={<ServiceHubPage />} />
                        <Route path="/access-code-management" element={<AccessCodeManagementPage />} />
                    </Route>

                    {/* --- Catch-all Route --- */}
                    {/* This route matches any URL that hasn't been matched above and redirects to the homepage */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
