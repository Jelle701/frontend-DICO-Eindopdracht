// src/components/PublicRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';

function PublicRoute({ children }) {
    const { isAuth, loading } = useUser();

    // Als we nog aan het laden zijn, toon een laadbericht.
    if (loading) {
        return <div>Aan het laden...</div>;
    }

    // Als het laden klaar is en de gebruiker WEL is ingelogd, stuur door naar het dashboard.
    if (isAuth) {
        return <Navigate to="/dashboard" />;
    }

    // Als het laden klaar is en de gebruiker NIET is ingelogd, toon de publieke pagina.
    return children;
}

export default PublicRoute;