import apiClient from '../../services/ApiClient.jsx';
import { handleApiError } from '../../services/ApiErrorHandler.jsx';

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

import apiClient from '../../services/ApiClient.jsx';

/**
 * Haalt de profielen op van alle patiënten die aan de ingelogde ouder (guardian) zijn gekoppeld.
 * @returns {Promise<{data: any, error: any}>}
 */
export const getLinkedPatientsForGuardian = async () => {
    try {
        const response = await apiClient.get('/guardian/linked-patients');
        return { data: response.data, error: null };
    } catch (error) {
        console.error('[GuardianService] Fout bij ophalen gekoppelde patiënten:', error);
        return { data: null, error };
    }
};

/**
 * Koppelt een patiënt aan de ingelogde ouder (guardian) via een toegangscode.
 * @param {string} accessCode - De unieke toegangscode van de patiënt.
 * @returns {Promise<{data: any, error: any}>}
 */
export const linkPatientToGuardian = async (accessCode) => {
    try {
        const response = await apiClient.post('/guardian/link-patient', { accessCode });
        return { data: response.data, error: null };
    } catch (error) {
        console.error('[GuardianService] Fout bij koppelen patiënt:', error);
        return { data: null, error };
    }
};

/**
 * Haalt de glucosemetingen op voor een specifieke patiënt, gekoppeld aan de ouder.
 * @param {number} patientId - Het ID van de patiënt.
 * @returns {Promise<{data: any, error: any}>}
 */
export const getGlucoseMeasurementsForPatient = async (patientId) => {
    try {
        const response = await apiClient.get(`/guardian/linked-patients/${patientId}/glucose-measurements`);
        return { data: response.data, error: null };
    } catch (error) {
        console.error(`[GuardianService] Fout bij ophalen glucosemetingen voor patiënt ${patientId}:`, error);
        return { data: null, error };
    }
};
