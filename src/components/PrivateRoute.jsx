// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '../contexts/AuthContext.jsx';

// Een lijst van alle routes die bij de onboarding horen.
const ONBOARDING_ROUTES = [
    '/register-details',
    '/onboarding',
    '/medicine-info',
    '/devices'
];

function PrivateRoute({ children }) {
    const { isAuth, loading: authLoading } = useAuth();
    const { user, loading: userLoading } = useUser();
    const location = useLocation();

    if (authLoading || userLoading) {
        return <div>Laden...</div>; // Wacht tot alles geladen is
    }

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user) {
        return <div>Gebruikersprofiel ophalen...</div>;
    }

    // Bepaal of de gebruiker de onboarding volledig heeft doorlopen.
    // We gebruiken 'hasDetails' als de definitieve vlag.
    const isFullyOnboarded = user.flags.hasDetails;
    const currentPath = location.pathname;
    const isTryingToAccessOnboarding = ONBOARDING_ROUTES.includes(currentPath);

    // Scenario 1: De gebruiker is volledig onboarded.
    if (isFullyOnboarded) {
        // Als ze proberen terug te gaan naar een onboarding pagina, stuur ze naar het dashboard.
        if (isTryingToAccessOnboarding) {
            return <Navigate to="/dashboard" replace />;
        }
        // Anders mogen ze overal naartoe.
        return children;
    }

    // Scenario 2: De gebruiker is NOG NIET volledig onboarded.
    if (!isFullyOnboarded) {
        // Als ze proberen een pagina buiten de onboarding te bereiken (zoals het dashboard),
        // stuur ze dan terug naar de eerste stap.
        if (!isTryingToAccessOnboarding) {
            return <Navigate to={ONBOARDING_ROUTES[0]} replace />;
        }
        // Als ze binnen de onboarding flow navigeren, is dat prima.
        return children;
    }

    // Fallback, zou niet bereikt moeten worden.
    return children;
}

export default PrivateRoute;