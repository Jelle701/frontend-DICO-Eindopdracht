import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// VERBETERING: We gebruiken nu de geconsolideerde useAuth hook.
import { useAuth } from '../contexts/AuthContext.jsx';

function PrivateRoute({ children }) {
    // Haal de authenticatiestatus en laadstatus op uit onze AuthContext.
    const { isAuth, loading } = useAuth();
    const location = useLocation();

    // 1. Als de authenticatiestatus nog wordt bepaald, toon een laadindicator.
    //    Dit voorkomt een 'flikkering' naar de loginpagina voor reeds ingelogde gebruikers.
    if (loading) {
        // Overweeg hier een mooiere 'spinner' of 'skeleton' component.
        return <div>Authenticatie controleren...</div>;
    }

    // 2. Als het laden klaar is en de gebruiker NIET is ingelogd, stuur hem door.
    //    We sturen de gebruiker naar de loginpagina.
    //    'state={{ from: location }}' zorgt ervoor dat we de gebruiker na het inloggen
    //    terug kunnen sturen naar de pagina die hij oorspronkelijk wilde bezoeken.
    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Als het laden klaar is en de gebruiker is ingelogd, toon de gevraagde pagina.
    return children;
}

export default PrivateRoute;
