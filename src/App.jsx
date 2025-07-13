import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/open/LoginPage.jsx';
import RegisterPage from './pages/open/register/RegisterPage.jsx';
import DashboardPage from './pages/Authorization/DashboardPage.jsx';
import GlucosePage from './pages/Authorization/GlucosePage.jsx';
import HomePage from './pages/open/HomePage.jsx';
import { useUser } from './contexts/UserContext';

function App() {
    const { user } = useUser();

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
            <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/" />} />
            <Route path="/glucose/:id" element={user ? <GlucosePage /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
