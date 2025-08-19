// src/services/ProfileService.jsx
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler'; // Importeer de centrale handler

/**
 * Haalt de volledige profielgegevens op van de ingelogde gebruiker.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function getMyProfile() {
    try {
        const { data } = await apiClient.get('/profile/me');
        return { data, error: null };
    } catch (error) {
        return handleApiError(error); // Gebruik de centrale handler
    }
}

/**
 * Update de profielgegevens van de gebruiker.
 * @param {Object} profileData - De te updaten profielgegevens.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function updateUserProfile(profileData) {
    try {
        const { data } = await apiClient.put('/profile/details', profileData);
        return { data, error: null };
    } catch (error) {
        return handleApiError(error); // Gebruik de centrale handler
    }
}