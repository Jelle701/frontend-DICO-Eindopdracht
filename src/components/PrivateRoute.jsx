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

    const isFullyOnboarded = user?.flags?.hasDetails;
    const currentPath = location.pathname;
    const isTryingToAccessOnboarding = ONBOARDING_ROUTES.includes(currentPath);

    // --- DE FIX: Centrale navigatielogica voor ingelogde gebruikers ---

    // Bepaal de standaard startpagina op basis van de rol.
    let intendedStartPath = '/';
    switch (user.role) {
        case 'PATIENT':
            intendedStartPath = '/dashboard';
            break;
        case 'GUARDIAN':
            intendedStartPath = '/guardian-dashboard';
            break;
        case 'PROVIDER':
            intendedStartPath = '/provider-dashboard'; // DE FIX
            break;
        default:
            intendedStartPath = '/';
    }

    // Scenario 1: Gebruiker is NIET volledig onboarded.
    if (!isFullyOnboarded) {
        if (!isTryingToAccessOnboarding) {
            return <Navigate to={FIRST_ONBOARDING_STEP} replace />;
        }
        return <Outlet />;
    }

    // Scenario 2: Gebruiker is WEL volledig onboarded.
    if (isTryingToAccessOnboarding) {
        return <Navigate to={intendedStartPath} replace />;
    }

    // Zorgverleners mogen niet op het patiëntendashboard zijn.
    if (user.role === 'PROVIDER' && currentPath === '/dashboard') {
         return <Navigate to={intendedStartPath} replace />;
    }
    
    // Patiënten mogen niet op zorgverlenerpaginas zijn.
    if (user.role === 'PATIENT' && (currentPath === '/provider-dashboard' || currentPath === '/patient-portal')) {
         return <Navigate to={intendedStartPath} replace />;
    }

    // In alle andere gevallen voor een volledig onboarded gebruiker, geef toegang.
    return <Outlet />;
}

export default PrivateRoute;
