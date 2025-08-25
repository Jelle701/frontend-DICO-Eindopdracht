/**
 * @file PublicRoute.jsx
 * @description This component acts as a route guard for public routes that should not be accessible to authenticated
 * users, such as the login and registration pages. If a logged-in user tries to access a public route, they are
 * automatically redirected to their dashboard.
 *
 * @component
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The public page component to be rendered (e.g., `<LoginPage />`).
 * @returns {JSX.Element} Renders the child component if the user is not authenticated, or a `<Navigate>` component to redirect to the dashboard if they are.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
    const { isAuth } = useAuth();

    // If the user is authenticated, redirect them away from the public page to the dashboard.
    // Otherwise, render the intended public page (the children).
    return isAuth ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
