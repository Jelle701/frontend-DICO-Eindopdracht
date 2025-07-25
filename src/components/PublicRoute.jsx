import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
    const { isAuth } = useAuth();
    return isAuth ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;