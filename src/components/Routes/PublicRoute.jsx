import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, useUser } from '../../contexts/AuthContext.jsx';
import { ROLES } from '../../constants.js'; // Importeer de constanten

const PublicRoute = ({ children }) => {
    const { isAuth, loading: authLoading } = useAuth();
    const { user, loading: userLoading } = useUser();

    // Wacht tot de authenticatie- en gebruikersdata is geladen
    if (authLoading || userLoading) {
        return <div className="loading-fallback-message">Laden...</div>; // Of een spinner
    }

    // Als de gebruiker geauthenticeerd is, stuur ze naar de juiste startpagina
    if (isAuth) {
        // Als de gebruiker nog geen rol heeft, stuur naar de rol-selectie pagina
        if (!user || !user.role) {
            return <Navigate to="/onboarding/role" replace />;
        }

        // Bepaal de startpagina op basis van de rol
        let intendedStartPath = '/'; // Fallback

        switch (user.role) {
            case ROLES.ADMIN:
                intendedStartPath = '/admin-dashboard';
                break;
            case ROLES.PATIENT:
                intendedStartPath = '/dashboard';
                break;
            case ROLES.GUARDIAN:
                // Als de ouder/voogd al een patiënt heeft gekoppeld, stuur naar het portaal.
                if (user.linkedPatients && user.linkedPatients.length > 0) {
                    intendedStartPath = '/guardian-portal';
                } else {
                    // Anders, stuur naar de pagina om een patiënt te koppelen.
                    intendedStartPath = '/onboarding/link-patient';
                }
                break;
            case ROLES.PROVIDER:
                intendedStartPath = '/provider-dashboard';
                break;
            default:
                intendedStartPath = '/';
        }
        return <Navigate to={intendedStartPath} replace />;
    }

    // Als de gebruiker niet geauthenticeerd is, toon de publieke route
    return children;
};

export default PublicRoute;
