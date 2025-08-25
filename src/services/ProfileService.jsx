/**
 * @file ProfileService.jsx
 * @description This service handles all API communications related to user profiles. It provides functions
 * for fetching and updating the profile data of the currently authenticated user.
 *
 * @module ProfileService
 */
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler'; // Importeer de centrale handler

/**
 * Retrieves the complete profile data for the currently logged-in user.
 * @returns {Promise<{data: object|null, error: object|null}>} A promise that resolves to an object containing the user's profile data or an error object.
 */
export async function getMyProfile() {
    try {
        const { data } = await apiClient.get('/profile/me');
        return { data, error: null };
    } catch (error) {
        const formattedError = handleApiError(error);
        return { data: null, error: formattedError };
    }
}

/**
 * Updates the profile data for the currently logged-in user.
 * @param {Object} profileData - An object containing the profile fields to be updated.
 * @returns {Promise<{data: object|null, error: object|null}>} A promise that resolves to an object containing the updated profile data or an error object.
 */
export async function updateUserProfile(profileData) {
    try {
        const { data } = await apiClient.put('/profile/details', profileData);
        return { data, error: null };
    } catch (error) {
        const formattedError = handleApiError(error);
        return { data: null, error: formattedError };
    }
}