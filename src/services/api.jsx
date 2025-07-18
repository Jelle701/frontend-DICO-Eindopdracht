// src/services/api.jsx
import apiClient from './ApiClient';

export async function registerUser(userData) {
    const { data } = await apiClient.post('/users/register', userData);
    return data;
}

// --- NIEUWE FUNCTIE ---
// Deze functie stuurt de verzamelde onboarding-data naar het beveiligde
// '/api/users/onboarding' endpoint op de backend.
export async function saveOnboardingData(onboardingData) {
    const { data } = await apiClient.post('/users/onboarding', onboardingData);
    return data;
}