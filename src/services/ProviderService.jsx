import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * Koppelt een patiënt aan de ingelogde zorgverlener via een toegangscode.
 * @param {string} accessCode De door de patiënt verstrekte code.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function linkPatientToProvider(accessCode) {
    try {
        // De backend moet een beveiligd endpoint hebben dat deze request afhandelt.
        const { data } = await apiClient.post('/api/provider/link-patient', { accessCode });
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * Haalt de lijst op van alle patiënten die gekoppeld zijn aan de ingelogde zorgverlener.
 * @returns {Promise<{data: Array|null, error: object|null}>}
 */
export async function getLinkedPatients() {
    try {
        const { data } = await apiClient.get('/api/provider/patients');
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}
