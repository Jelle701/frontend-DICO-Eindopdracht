// src/components/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';

function PublicRoute({ children }) {
    const { user } = useUser();

    return !user ? children : <Navigate to="/dashboard" />;
}

export default PublicRoute;
