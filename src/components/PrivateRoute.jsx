import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '../contexts/AuthContext.jsx';

// DE FIX: Deze lijst bevat nu de JUISTE, moderne onboarding routes.
const ONBOARDING_ROUTES = [
    '/onboarding/role',
    '/onboarding/preferences',
    '/onboarding/medicine',
    '/onboarding/devices',
    '/onboarding/link-patient'
];

// De eerste stap in de onboarding is altijd het kiezen van een rol.
const FIRST_ONBOARDING_STEP = '/onboarding/role';

function PrivateRoute() {
    const { isAuth, loading: authLoading } = useAuth();
    const { user, loading: userLoading } = useUser();
    const location = useLocation();

    // Wacht tot alle authenticatie-data is geladen.
    if (authLoading || userLoading) {
        return <div>Laden...</div>;
    }

    // Als de gebruiker niet is ingelogd, stuur naar de login-pagina.
    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Als de gebruiker is ingelogd, maar het profiel nog niet is geladen, wacht.
    if (!user) {
        return <div>Gebruikersprofiel ophalen...</div>;
    }

    // Controleer veilig of de gebruiker de onboarding heeft voltooid.
    const isFullyOnboarded = user?.flags?.hasDetails;

    const currentPath = location.pathname;
    const isTryingToAccessOnboarding = ONBOARDING_ROUTES.includes(currentPath);

    // Scenario 1: De gebruiker is volledig onboarded.
    if (isFullyOnboarded) {
        // Als ze proberen terug te gaan naar een onboarding pagina, stuur ze naar het dashboard.
        if (isTryingToAccessOnboarding) {
            return <Navigate to="/dashboard" replace />;
        }
        // Anders, geef toegang tot de gevraagde pagina.
        return <Outlet />;
    }

    // Scenario 2: De gebruiker is NOG NIET volledig onboarded.
    if (!isFullyOnboarded) {
        // Als ze proberen een pagina buiten de onboarding te bereiken,
        // stuur ze dan terug naar de eerste stap.
        if (!isTryingToAccessOnboarding) {
            return <Navigate to={FIRST_ONBOARDING_STEP} replace />;
        }
        // Als ze binnen de onboarding flow navigeren, is dat prima.
        return <Outlet />;
    }

    // Fallback die normaal niet bereikt wordt.
    return <Outlet />;
}

export default PrivateRoute;
