// src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';

function PrivateRoute({ children }) {
    const { isAuth, loading } = useUser();
    const location = useLocation();

    // 1. Als we nog aan het laden zijn, toon een laadbericht. NIET doorsturen.
    if (loading) {
        return <div>Aan het laden...</div>;
    }

    // 2. Als het laden klaar is en de gebruiker NIET is ingelogd, stuur door naar de loginpagina.
    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Als het laden klaar is en de gebruiker WEL is ingelogd, toon de pagina.
    return children;
}

export default PrivateRoute;