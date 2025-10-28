import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * Fetches the diabetes summary for the currently logged-in patient.
 * This can also be used with a delegated token for providers viewing a patient.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const getDiabetesSummary = async () => {
    try {
        // The apiClient automatically handles the user token and the delegated token.
        const response = await apiClient.get('/diabetes/summary');
        return { data: response.data, error: null };
    } catch (error) {
        // The handleApiError utility provides consistent error handling.
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * Fetches the diabetes summary for a specific patient.
 * Corresponds to: GET /api/diabetes/summary/patient/{patientId}
 * This function is intended for use by providers or guardians viewing a specific patient's data.
 * @param {number} patientId The ID of the patient.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const getDiabetesSummaryForPatient = async (patientId) => {
    try {
        const response = await apiClient.get(`/diabetes/summary/patient/${patientId}`);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

// Note: The functions getDiabetesSummaryForPatient and getDiabetesSummaryForGuardian
// have been removed from this file. Their functionality is now centralized in
// getPatientDiabetesSummary in ProviderService.jsx to align with the new backend structure.
