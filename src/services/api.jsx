// src/services/api.jsx
import apiClient from './ApiClient'; // Gebruik de geconfigureerde apiClient

export async function registerUser(userData) {
    // userData bevat nu: { firstName, lastName, dob, email, password }
    const { data } = await apiClient.post('/users/register', userData);
    return data;
}

// Hier kunnen in de toekomst andere API-calls komen,
// zoals het opslaan van onboarding-data.
/*
export async function saveOnboardingData(onboardingData) {
    const { data } = await apiClient.post('/users/onboarding', onboardingData);
    return data;
}
*/