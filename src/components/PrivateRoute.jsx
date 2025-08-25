/**
 * @file PrivateRoute.jsx
 * @description This component acts as a route guard for routes that require authentication. It also enforces the
 * user onboarding flow, ensuring that new users complete all necessary steps before accessing the main application.
 *
 * @component
 * @returns {JSX.Element} Renders the child route (`<Outlet />`) if access is permitted, or a `<Navigate>` component to redirect the user if access is denied.
 *
 * @logic
 * The component follows a specific sequence of checks:
 * 1.  **Loading State**: It first waits for both the authentication status and user profile to finish loading to prevent premature redirects.
 * 2.  **Authentication Check**: If the user is not authenticated (`isAuth` is false), they are immediately redirected to the `/login` page.
 * 3.  **Onboarding Status Check**: It checks a flag `user.flags.hasDetails` to determine if the user has completed the onboarding process.
 *     - **If Onboarded**: The user has full access to all private routes. If they attempt to navigate back to an onboarding URL, they are redirected to the `/dashboard`.
 *     - **If Not Onboarded**: The user is restricted to only the onboarding URLs. If they attempt to access any other private page (e.g., `/dashboard`), they are forced back to the first step of the onboarding process (`/onboarding/role`).
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '../contexts/AuthContext.jsx';

// A constant list of all valid routes within the onboarding flow.
const ONBOARDING_ROUTES = [
    '/onboarding/role',
    '/onboarding/preferences',
    '/onboarding/medicine',
    '/onboarding/devices'
];

// The designated first step of the onboarding process.
const FIRST_ONBOARDING_STEP = '/onboarding/role';

function PrivateRoute() {
    const { isAuth, loading: authLoading } = useAuth();
    const { user, loading: userLoading } = useUser();
    const location = useLocation();

    // Show a loading state while authentication and user status are being determined.
    if (authLoading || userLoading) {
        return <div>Laden...</div>; // Or a more sophisticated spinner component
    }

    // If the user is not logged in, redirect them to the login page, passing the
    // intended destination via location state for a better user experience after login.
    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If the user is logged in but the profile hasn't loaded yet (a rare edge case), wait.
    if (!user) {
        return <div>Gebruikersprofiel ophalen...</div>;
    }

    // Determine if the user has completed the entire onboarding process based on a backend flag.
    const isFullyOnboarded = user?.flags?.hasDetails;

    const currentPath = location.pathname;
    const isTryingToAccessOnboarding = ONBOARDING_ROUTES.includes(currentPath);

    // Scenario 1: The user is fully onboarded.
    if (isFullyOnboarded) {
        // If they try to go back to an onboarding page, redirect them to the main dashboard.
        if (isTryingToAccessOnboarding) {
            return <Navigate to="/dashboard" replace />;
        }
        // Otherwise, they are allowed to access the requested private page.
        return <Outlet />;
    }

    // Scenario 2: The user is NOT yet fully onboarded.
    if (!isFullyOnboarded) {
        // If they try to access any page outside of the defined onboarding flow,
        // force them back to the first step of the onboarding process.
        if (!isTryingToAccessOnboarding) {
            return <Navigate to={FIRST_ONBOARDING_STEP} replace />;
        }
        // If they are navigating within the onboarding flow, that is allowed.
        return <Outlet />;
    }

    // Fallback case, which should not normally be reached but is good practice.
    return <Outlet />;
}

export default PrivateRoute;
