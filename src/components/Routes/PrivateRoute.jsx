import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '../../contexts/AuthContext.jsx';
import { ROLES } from '../../constants.js'; // Importeer de constanten

// Robuuste helper functie om de rol te normaliseren
const normalizeRole = (role) => {
    if (typeof role !== 'string') return null;
    let normalized = role.toUpperCase(); // 1. Converteer naar hoofdletters
    if (normalized.startsWith('ROLE_')) { // 2. Verwijder prefix
        normalized = normalized.substring(5);
    }
    return normalized;
};

// Define routes that are part of the initial onboarding Routes
const ONBOARDING_ROUTES = [
    '/onboarding/role',
    '/onboarding/preferences',
    '/onboarding/medicine',
    '/onboarding/devices',
];

const FIRST_ONBOARDING_STEP = '/onboarding/role';

function PrivateRoute() {
    const { isAuth, loading: authLoading } = useAuth();
    const { user, loading: userLoading } = useUser();
    const location = useLocation();

    // Show a loading indicator while authentication status is being determined
    if (authLoading || userLoading) {
        return <div className="loading-fallback-message">Laden...</div>;
    }

    // If not authenticated, redirect to the login page
    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated but user profile is not yet loaded (edge case)
    if (!user) {
        return <div className="loading-fallback-message">Gebruikersprofiel ophalen...</div>;
    }

    const userRole = normalizeRole(user.role);
    const currentPath = location.pathname;

    // --- Main Navigation & Access Control Logic ---

    // Admins have unrestricted access
    if (userRole === ROLES.ADMIN) {
        return <Outlet />;
    }

    const isFullyOnboarded = user?.flags?.hasDetails;
    const isTryingToAccessOnboarding = ONBOARDING_ROUTES.includes(currentPath);

    // 1. User is NOT fully onboarded
    if (!isFullyOnboarded) {
        // If they are not on a valid onboarding route, force them to the first step.
        if (!isTryingToAccessOnboarding) {
            return <Navigate to={FIRST_ONBOARDING_STEP} replace />;
        }
        // Otherwise, allow access to the current onboarding page.
        return <Outlet />;
    }

    // 2. User IS fully onboarded
    if (isFullyOnboarded) {
        // If an onboarded user tries to access an old onboarding page, redirect them to their main portal.
        if (isTryingToAccessOnboarding) {
            let homePath = '/';
            switch (userRole) {
                case ROLES.PATIENT:
                    homePath = '/dashboard';
                    break;
                case ROLES.PROVIDER:
                    homePath = '/provider-dashboard';
                    break;
                case ROLES.GUARDIAN:
                    homePath = '/guardian-portal';
                    break;
                default:
                    homePath = '/';
            }
            return <Navigate to={homePath} replace />;
        }
    }

    // 3. Role-based access control for specific pages
    // Redirect PROVIDER from patient dashboard to their own
    if (userRole === ROLES.PROVIDER && currentPath === '/dashboard') {
         return <Navigate to="/provider-dashboard" replace />;
    }
    
    // Prevent PATIENT from accessing provider/guardian portals
    if (userRole === ROLES.PATIENT && (currentPath === '/provider-dashboard' || currentPath === '/patient-portal' || currentPath === '/guardian-portal')) {
         return <Navigate to="/dashboard" replace />;
    }

    // Prevent GUARDIAN from accessing patient/provider dashboards
    if (userRole === ROLES.GUARDIAN && (currentPath === '/dashboard' || currentPath === '/provider-dashboard' || currentPath === '/patient-portal')) {
        return <Navigate to="/guardian-portal" replace />;
    }

    // If no other rules apply, render the requested page.
    return <Outlet />;
}

export default PrivateRoute;
