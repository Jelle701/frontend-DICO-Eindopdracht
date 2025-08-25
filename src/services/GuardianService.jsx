/**
 * @file GuardianService.jsx
 * @description This service provides functions specifically for the 'Guardian' user role. It handles API
 * communications for actions a guardian can perform, such as linking their account to a patient's account.
 *
 * @module GuardianService
 */
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * Links the currently logged-in guardian to a patient account using a unique access code provided by the patient.
 * @param {string} accessCode The access code provided by the patient.
 * @returns {Promise<{data: object|null, error: object|null}>} A promise that resolves to an object containing the success response or an error object.
 */
export async function linkPatientByCode(accessCode) {
    try {
        // The backend must have a secure endpoint that handles this request.
        const { data } = await apiClient.post('/api/guardian/link-patient', { accessCode });
        return { data, error: null };
    } catch (error) {
        const formattedError = handleApiError(error);
        return { data: null, error: formattedError };
    }
}
