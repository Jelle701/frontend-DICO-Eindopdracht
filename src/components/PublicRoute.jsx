// src/components/PublicRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
// VERBETERING: We gebruiken nu de geconsolideerde useAuth hook.
import { useAuth } from '../contexts/AuthContext.jsx';

function PublicRoute({ children }) {
    // Haal de authenticatiestatus en laadstatus op uit onze AuthContext.
    const { isAuth, loading } = useAuth();

    // 1. Als de authenticatiestatus nog wordt bepaald, toon een laadindicator.
    //    Dit voorkomt dat een ingelogde gebruiker kort een publieke pagina ziet
    //    voordat hij wordt doorgestuurd.
    if (loading) {
        return <div>Authenticatie controleren...</div>;
    }

    // 2. Als het laden klaar is en de gebruiker WEL is ingelogd, stuur hem weg
    //    van de publieke pagina (zoals /login) naar het dashboard.
    if (isAuth) {
        return <Navigate to="/dashboard" replace />;
    }

    // 3. Als het laden klaar is en de gebruiker NIET is ingelogd, toon de publieke pagina.
    return children;
}

export default PublicRoute;
