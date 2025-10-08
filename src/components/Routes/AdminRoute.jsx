import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../contexts/AuthContext.jsx';

const AdminRoute = () => {
    const { user, loading } = useUser();

    if (loading) {
        // Show a loading indicator while user data is being fetched
        return <div>Laden...</div>;
    }

    // Check if user is authenticated and has the ADMIN role
    if (user && user.role === 'ADMIN') {
        return <Outlet />;
    } else {
        // If not an admin, redirect to the dashboard or a 'not authorized' page
        return <Navigate to="/dashboard" replace />;
    }
};

export default AdminRoute;
