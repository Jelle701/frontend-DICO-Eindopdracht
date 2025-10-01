import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '../contexts/AuthContext.jsx';

const ONBOARDING_ROUTES = [
    '/onboarding/role',
    '/onboarding/preferences',
    '/onboarding/medicine',
    '/onboarding/devices',
    '/onboarding/link-patient'
];

const FIRST_ONBOARDING_STEP = '/onboarding/role';

function PrivateRoute() {
    const { isAuth, loading: authLoading } = useAuth();
    const { user, loading: userLoading } = useUser();
    const location = useLocation();

    if (authLoading || userLoading) {
        return <div>Laden...</div>;
    }

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user) {
        return <div>Gebruikersprofiel ophalen...</div>;
    }

    // --- Main Navigation Logic ---

    // NEW: If user is ADMIN, bypass all onboarding and standard role checks.
    if (user.role === 'ADMIN') {
        return <Outlet />;
    }

    const isFullyOnboarded = user?.flags?.hasDetails;
    const currentPath = location.pathname;
    const isTryingToAccessOnboarding = ONBOARDING_ROUTES.includes(currentPath);

    // 1. User is NOT fully onboarded
    if (!isFullyOnboarded) {
        // If they are not on an onboarding route, force them to the first step.
        if (!isTryingToAccessOnboarding) {
            return <Navigate to={FIRST_ONBOARDING_STEP} replace />;
        }
        // Otherwise, allow access to the current onboarding page.
        return <Outlet />;
    }

    // 2. User IS fully onboarded
    if (isFullyOnboarded) {
        // EXCEPTION FOR GUARDIAN: A Guardian's main task is to link a patient.
        // If they are a Guardian, their primary destination should be the link page.
        if (user.role === 'GUARDIAN') {
            if (currentPath !== '/onboarding/link-patient') {
                return <Navigate to="/onboarding/link-patient" replace />;
            }
            return <Outlet />;
        }

        // For all OTHER onboarded users (e.g., PATIENT, PROVIDER):
        // If they try to access any onboarding page, redirect them to their final destination.
        if (isTryingToAccessOnboarding) {
            let intendedStartPath = user.role === 'PATIENT' ? '/dashboard' : '/provider-dashboard';
            return <Navigate to={intendedStartPath} replace />;
        }
    }

    // 3. Role-based access control for non-onboarding pages
    if (user.role === 'PROVIDER' && currentPath === '/dashboard') {
         return <Navigate to="/provider-dashboard" replace />;
    }
    
    if (user.role === 'PATIENT' && (currentPath === '/provider-dashboard' || currentPath === '/patient-portal')) {
         return <Navigate to="/dashboard" replace />;
    }

    // If no other rules apply, render the requested page.
    return <Outlet />;
}

export default PrivateRoute;
