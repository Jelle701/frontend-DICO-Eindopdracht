/**
 * @file ProviderService.jsx
 * @description This service provides functions specifically for the 'Provider' (healthcare professional) user role.
 * It handles API communications for actions a provider can perform, such as linking patients and retrieving their list of linked patients.
 *
 * @module ProviderService
 */
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * Links a patient to the logged-in healthcare provider using an access code provided by the patient.
 * @param {string} accessCode The access code provided by the patient.
 * @returns {Promise<{data: object|null, error: object|null}>} A promise that resolves to an object containing the success response or an error object.
 */
export async function linkPatientToProvider(accessCode) {
    try {
        const { data } = await apiClient.post('/api/provider/link-patient', { accessCode });
        return { data, error: null };
    } catch (error) {
        const formattedError = handleApiError(error);
        return { data: null, error: formattedError };
    }
}

/**
 * Retrieves the list of all patients currently linked to the logged-in healthcare provider.
 * @returns {Promise<{data: Array|null, error: object|null}>} A promise that resolves to an object containing an array of linked patients or an error object.
 */
export async function getLinkedPatients() {
    try {
        const { data } = await apiClient.get('/api/provider/patients');
        return { data, error: null };
    } catch (error) {
        const formattedError = handleApiError(error);
        return { data: null, error: formattedError };
    }
}