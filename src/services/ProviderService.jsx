import apiClient from './ApiClient.jsx';
import { handleApiError } from './ApiErrorHandler.jsx';

/**
 * Links a patient to the currently logged-in provider or guardian using an access code.
 * Corresponds to: POST /api/provider/link-patient
 * @param {string} accessCode The patient's unique access code.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const linkPatient = async (accessCode) => {
    try {
        const response = await apiClient.post('/provider/link-patient', { accessCode });
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * Fetches all patients linked to the currently logged-in provider or guardian.
 * Corresponds to: GET /api/provider/patients
 * @returns {Promise<{data: any, error: any}>}
 */
export const getLinkedPatients = async () => {
    try {
        const response = await apiClient.get('/provider/patients');
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * Fetches glucose measurements for a specific patient.
 * Corresponds to: GET /api/provider/patients/{patientId}/glucose-measurements
 * @param {number} patientId The ID of the patient.
 * @returns {Promise<{data: any, error: any}>}
 */
export const getPatientGlucoseMeasurements = async (patientId) => {
    try {
        const response = await apiClient.get(`/provider/patients/${patientId}/glucose-measurements`);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * Fetches the diabetes summary for a specific patient.
 * Corresponds to: GET /api/provider/patients/{patientId}/diabetes-summary
 * @param {number} patientId The ID of the patient.
 * @returns {Promise<{data: any, error: any}>}
 */
export const getPatientDiabetesSummary = async (patientId) => {
    try {
        const response = await apiClient.get(`/provider/patients/${patientId}/diabetes-summary`);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * Requests a temporary, delegated token for a specific patient.
 * @param {number} patientId The ID of the patient.
 * @returns {Promise<{data: {delegatedToken: string}|null, error: object|null}>}
 */
export const getDelegateTokenForPatient = async (patientId) => {
    try {
        const response = await apiClient.post(`/provider/patients/${patientId}/delegate-token`);
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};

/**
 * Fetches summary data for the provider dashboard.
 * Corresponds to: GET /api/provider/summary
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const getProviderDashboardSummary = async () => {
    try {
        const response = await apiClient.get('/provider/summary');
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
};
