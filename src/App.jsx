import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Pages
import HomePage from "./pages/open/HomePage";
import LoginPage from "./pages/open/LoginPage";
import RegisterPage from "./pages/open/onboarding/RegisterPage";
import VerifyEmailPage from "./pages/open/onboarding/VerifyEmailPage";
import RegisterDetailsPage from "./pages/open/onboarding/RegisterDetailsPage";
import OnboardingPreferences from "./pages/open/onboarding/OnboardingPreferences";
import MedicineInfo from "./pages/open/onboarding/MedicineInfo";
import DiabeticDevices from "./pages/open/onboarding/DiabeticDevices";

import DashboardPage from "./pages/Authorization/DashboardPage";
import GlucosePage from "./pages/Authorization/GlucosePage";

// Wrapper voor niet-ingelogden
function PublicRoute() {
    const { isAuth, loading } = useAuth();
    if (loading) return <p>Loading…</p>;
    return !isAuth ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

// Guard voor ingelogden + onboarding‑flow
function OnboardingGuard() {
    const { user, isAuth, loading } = useAuth();
    if (loading) return <p>Loading…</p>;
    if (!isAuth) return <Navigate to="/login" replace />;

    // flags vanuit jouw backend/profile
    const { emailVerified, hasDetails, hasPreferences, hasDevices } = user.flags || {};

    if (!emailVerified)  return <Navigate to="/verify" replace />;
    if (!hasDetails)     return <Navigate to="/register-details" replace />;
    if (!hasPreferences) return <Navigate to="/onboarding" replace />;
    if (!hasDevices)     return <Navigate to="/devices" replace />;

    // alle stappen voltooid → child routes tonen
    return <Outlet />;
}

function App() {
    return (
        <Routes>
            {/* 1. Always-public */}
            <Route path="/" element={<HomePage />} />

            {/* 2. Alleen voor uitgelogden: login & registratie */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* 3. Ingelogd + onboarding-flow */}
            <Route element={<OnboardingGuard />}>
                {/* 3a. E‑mail verifiëren */}
                <Route path="/verify" element={<VerifyEmailPage />} />
                {/* 3b. Persoonsgegevens */}
                <Route path="/register-details" element={<RegisterDetailsPage />} />
                {/* 3c. Voorkeuren */}
                <Route path="/onboarding" element={<OnboardingPreferences />} />
                {/* 3d. Medicatie-info */}
                <Route path="/medicine-info" element={<MedicineInfo />} />
                {/* 3e. Apparaten */}
                <Route path="/devices" element={<DiabeticDevices />} />
                {/* 4. Eindelijk dashboard */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/glucose/:id" element={<GlucosePage />} />
            </Route>

            {/* 5. Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;