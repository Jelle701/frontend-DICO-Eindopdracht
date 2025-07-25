// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// General Page Components
import HomePage from "./pages/open/HomePage";
import LoginPage from "./pages/open/LoginPage";
import DashboardPage from "./pages/Authorization/DashboardPage";
import MyDataPage from "./pages/Authorization/MyDataPage.jsx";
import GlucoseLogPage from "./pages/Authorization/GlucoseLogPage.jsx"; // This import will now work

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

function App() {
    return (
        <Routes>
            {/* Publieke Routes: Toegankelijk voor iedereen */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/verify" element={<PublicRoute><VerifyEmailPage /></PublicRoute>} />

            {/*
              Beveiligde Routes: Vereisen authenticatie.
              De PrivateRoute component regelt de logica voor zowel de onboarding flow
              als de toegang tot de hoofdapplicatie.
            */}
            <Route element={<PrivateRoute />}>
                {/* Onboarding Flow Routes */}
                <Route path="/register-details" element={<RegisterDetailsPage />} />
                <Route path="/onboarding" element={<OnboardingPreferences />} />
                <Route path="/medicine-info" element={<MedicineInfo />} />
                <Route path="/devices" element={<DiabeticDevices />} />

                {/* Main Application Routes (na onboarding) */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/glucose-log" element={<GlucoseLogPage />} /> {/* This route is now valid */}
                <Route path="/my-data" element={<MyDataPage />} />
            </Route>

            {/* Fallback Route: Vangt alle niet-gedefinieerde paden op en stuurt door naar de homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;