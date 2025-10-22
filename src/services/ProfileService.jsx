import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * Haalt het profiel op van de ingelogde gebruiker.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function getMyProfile() {
    try {
        const { data } = await apiClient.get('/profile/me');
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * Werkt het profiel van de ingelogde gebruiker bij.
 * @param {object} profileData - De bij te werken profielgegevens.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function updateUserProfile(profileData) {
    try {
        const { data } = await apiClient.put('/profile/me', profileData);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * Slaat de LibreView-inloggegevens van de gebruiker op voor automatische synchronisatie.
 * @param {string} userId - De ID van de gebruiker.
 * @param {string} libreViewEmail - Het e-mailadres voor LibreView.
 * @param {string} libreViewPassword - Het wachtwoord voor LibreView.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function saveLibreViewCredentials(userId, { libreViewEmail, libreViewPassword }) {
    try {
        const payload = { libreViewEmail, libreViewPassword };
        const { data } = await apiClient.put(`/users/${userId}`, payload);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}
