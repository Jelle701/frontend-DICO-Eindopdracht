// src/services/OnboardingService.jsx
import apiClient from './ApiClient';

/**
 * Verstuurt de verzamelde onboarding-data naar de backend.
 * @param {object} onboardingData - De data die overeenkomt met de OnboardingRequestDto.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function submitOnboardingProfile(onboardingData) {
    try {
        // We gebruiken hier de nieuwe PUT endpoint zoals beschreven in de instructies.
        const { data } = await apiClient.put('/profile/details', onboardingData);
        return { data, error: null };
    } catch (error) {
        // We kunnen de generieke error handler uit AuthService hergebruiken
        // of een specifieke hier maken. Voor nu loggen we de fout.
        console.error("API Error submitting onboarding data:", error.response?.data);
        return {
            data: null,
            error: {
                message: error.response?.data?.message || 'Failed to save onboarding data.',
                status: error.response?.status,
            },
        };
    }
}