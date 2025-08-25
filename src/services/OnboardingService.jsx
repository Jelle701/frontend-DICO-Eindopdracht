/**
 * @file OnboardingService.jsx
 * @description This service is responsible for submitting the final, consolidated data from the user onboarding process
 * to the backend. It takes all the information collected across the onboarding steps and sends it to the user profile endpoint.
 *
 * @module OnboardingService
 */
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * Submits the collected onboarding data to the backend to finalize the user's profile setup.
 * @param {object} onboardingData - The complete onboarding data object, matching the structure expected by the backend (OnboardingRequestDto).
 * @returns {Promise<{data: object|null, error: object|null}>} A promise that resolves to an object containing the success response or an error object.
 */
export async function submitOnboardingProfile(onboardingData) {
    try {
        // This uses the PUT endpoint to update the user's profile with the detailed onboarding data.
        const { data } = await apiClient.put('/profile/details', onboardingData);
        return { data, error: null };
    } catch (error) {
        const formattedError = handleApiError(error);
        return { data: null, error: formattedError };
    }
}
