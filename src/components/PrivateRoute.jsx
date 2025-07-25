// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '../contexts/AuthContext.jsx';

// Een lijst van alle routes die bij de onboarding horen.
const ONBOARDING_ROUTES = [
    '/register-details',
    '/onboarding',
    '/medicine-info',
    '/devices'
];

function PrivateRoute() {
    const { isAuth, loading: authLoading } = useAuth();
    const { user, loading: userLoading } = useUser();
    const location = useLocation();

    // Toon een laadstatus terwijl de authenticatie- en gebruikersstatus wordt bepaald.
    if (authLoading || userLoading) {
        // Je kunt hier een mooiere spinner-component tonen.
        return <div>Laden...</div>;
    }

    // Als de gebruiker niet is ingelogd, stuur ze naar de login-pagina.
    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Als de gebruiker is ingelogd maar het profiel nog niet is geladen (zeldzaam geval), wacht.
    if (!user) {
        return <div>Gebruikersprofiel ophalen...</div>;
    }

    // Bepaal of de gebruiker de onboarding volledig heeft doorlopen.
    // FIX: Gebruik optional chaining (?.) om veilig 'hasDetails' te benaderen.
    // Dit voorkomt de crash als 'user.flags' nog niet bestaat na een verse login.
    const isFullyOnboarded = user?.flags?.hasDetails;

    const currentPath = location.pathname;
    const isTryingToAccessOnboarding = ONBOARDING_ROUTES.includes(currentPath);

    // Scenario 1: De gebruiker is volledig onboarded.
    if (isFullyOnboarded) {
        // Als ze proberen terug te gaan naar een onboarding pagina, stuur ze naar het dashboard.
        if (isTryingToAccessOnboarding) {
            return <Navigate to="/dashboard" replace />;
        }
        // Anders mogen ze de gevraagde pagina zien.
        // We gebruiken <Outlet /> in plaats van {children} voor betere compatibiliteit met React Router v6 layouts.
        return <Outlet />;
    }

    // Scenario 2: De gebruiker is NOG NIET volledig onboarded.
    if (!isFullyOnboarded) {
        // Als ze proberen een pagina buiten de onboarding te bereiken (zoals het dashboard),
        // stuur ze dan terug naar de eerste stap van de onboarding.
        if (!isTryingToAccessOnboarding) {
            return <Navigate to={ONBOARDING_ROUTES[0]} replace />;
        }
        // Als ze binnen de onboarding flow navigeren, is dat prima.
        return <Outlet />;
    }

    // Fallback, zou niet bereikt moeten worden, maar is goede practice.
    return <Outlet />;
}

export default PrivateRoute;