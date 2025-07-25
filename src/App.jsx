// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// --- FIX: Import all the necessary components ---

// General Page Components
import HomePage from "./pages/open/HomePage";
import LoginPage from "./pages/open/LoginPage";
import DashboardPage from "./pages/Authorization/DashboardPage";
import GlucosePage from "./pages/Authorization/GlucosePage";

// Onboarding Page Components
import RegisterPage from "./pages/open/onboarding/RegisterPage";
import VerifyEmailPage from "./pages/open/onboarding/VerifyEmailPage";
import RegisterDetailsPage from "./pages/open/onboarding/RegisterDetailsPage";
import OnboardingPreferences from "./pages/open/onboarding/OnboardingPreferences";
import MedicineInfo from "./pages/open/onboarding/MedicineInfo";
import DiabeticDevices from "./pages/open/onboarding/DiabeticDevices";

// Route Guard Components
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

// Note: OnboardingContextProvider is already handled in main.jsx, so it's not needed here.

function App() {
    return (
        <Routes>
            {/* Publieke Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/verify" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />

            {/* Beveiligde Routes & Onboarding Flow */}
            <Route path="/register-details" element={<PrivateRoute><RegisterDetailsPage /></PrivateRoute>} />
            <Route path="/onboarding" element={<PrivateRoute><OnboardingPreferences /></PrivateRoute>} />
            <Route path="/medicine-info" element={<PrivateRoute><MedicineInfo /></PrivateRoute>} />
            <Route path="/devices" element={<PrivateRoute><DiabeticDevices /></PrivateRoute>} />

            {/* Routes na volledige onboarding */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/glucose/:id" element={<PrivateRoute><GlucosePage /></PrivateRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;