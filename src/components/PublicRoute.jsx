import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, useUser } from '../contexts/AuthContext.jsx'; // Importeer useUser

const PublicRoute = ({ children }) => {
    const { isAuth, loading: authLoading } = useAuth();
    const { user, loading: userLoading } = useUser();

    // Wacht tot de authenticatie- en gebruikersdata is geladen
    if (authLoading || userLoading) {
        return <div>Laden...</div>; // Of een spinner
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
            case 'ADMIN':
                intendedStartPath = '/admin/dashboard';
                break;
            case 'PATIENT':
                intendedStartPath = '/dashboard';
                break;
            case 'GUARDIAN':
                // FIX: A Guardian's next step is always to link a patient.
                intendedStartPath = '/onboarding/link-patient';
                break;
            case 'PROVIDER':
                intendedStartPath = '/patient-portal';
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
