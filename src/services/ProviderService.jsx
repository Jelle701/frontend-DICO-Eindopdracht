import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * Koppelt een patiënt aan de ingelogde zorgverlener via een toegangscode.
 * @param {string} accessCode De door de patiënt verstrekte code.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function linkPatientToProvider(accessCode) {
    console.log(`%cProviderService: Calling linkPatientToProvider with code: ${accessCode}`, 'color: purple;');
    try {
        const { data } = await apiClient.post('/provider/link-patient', { accessCode });
        console.log('%cProviderService: linkPatientToProvider success:', 'color: green;', data);
        return { data, error: null };
    } catch (error) {
        console.error('ProviderService: linkPatientToProvider error:', error);
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * Haalt de lijst op van alle patiënten die gekoppeld zijn aan de ingelogde zorgverlener.
 * @returns {Promise<{data: Array|null, error: object|null}>}
 */
export async function getLinkedPatients() {
    console.log('%cProviderService: Calling getLinkedPatients', 'color: purple;');
    try {
        const { data } = await apiClient.get('/provider/patients');
        console.log('%cProviderService: getLinkedPatients success:', 'color: green;', data);
        return { data, error: null };
    } catch (error) {
        console.error('ProviderService: getLinkedPatients error:', error);
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * Verkrijgt een gedelegeerd token voor een specifieke gekoppelde patiënt.
 * @param {string} patientId De ID van de patiënt waarvoor het token moet worden verkregen.
 * @returns {Promise<{data: {delegatedToken: string, patientUsername: string}|null, error: object|null}>}
 */
export async function getDelegatedTokenForPatient(patientId) {
    console.log(`%cProviderService: Calling getDelegatedTokenForPatient for patientId: ${patientId}`, 'color: purple;');
    try {
        const { data } = await apiClient.post(`/provider/patients/${patientId}/delegate-token`);
        console.log('%cProviderService: getDelegatedTokenForPatient success:', 'color: green;', data);
        return { data, error: null };
    } catch (error) {
        console.error('ProviderService: getDelegatedTokenForPatient error:', error);
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * NIEUW: Haalt de dashboard-samenvatting op voor een SPECIFIEKE patiënt.
 * @param {string} patientId De ID van de patiënt.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function getProviderDashboardSummary(patientId) {
    console.log(`%cProviderService: Calling getProviderDashboardSummary for patientId: ${patientId}`, 'color: purple;');
    try {
        // FIX: Gebruik de nieuwe URL met patientId
        const { data } = await apiClient.get(`/provider/patients/${patientId}/dashboard-summary`);
        console.log(`%cProviderService: getProviderDashboardSummary for patientId ${patientId} success:`, 'color: green;', data);
        return { data, error: null };
    } catch (error) {
        console.error(`ProviderService: getProviderDashboardSummary for patientId ${patientId} error:`, error);
        return { data: null, error: handleApiError(error) };
    }
}
