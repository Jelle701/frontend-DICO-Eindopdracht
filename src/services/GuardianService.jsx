import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * Koppelt de ingelogde ouder/voogd aan een patiënt via een toegangscode.
 * @param {string} accessCode De door de patiënt verstrekte code.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function linkPatientByCode(accessCode) {
    try {
        // De backend moet een beveiligd endpoint hebben dat deze request afhandelt.
        const { data } = await apiClient.post('/api/guardian/link-patient', { accessCode });
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}
