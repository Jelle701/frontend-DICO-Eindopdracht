/**
 * @file GlucoseService.jsx
 * @description This service module is responsible for all API communications related to glucose data.
 * It provides functions to fetch recent glucose measurements and to add new ones, using the central
 * apiClient for requests and handleApiError for consistent error handling.
 *
 * @module GlucoseService
 */
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler'; // Gebruik de centrale error handler

/**
 * Fetches recent glucose measurements (last 90 days) from the backend for the authenticated user.
 * @returns {Promise<{data: Array|null, error: object|null}>} A promise that resolves to an object containing the measurement data or an error object.
 */
export async function getRecentGlucoseMeasurements() {
    try {
        const { data } = await apiClient.get('/glucose');
        return { data, error: null };
    } catch (error) {
        const formattedError = handleApiError(error);
        return { data: null, error: formattedError };
    }
}

/**
 * Adds a new, manual glucose measurement to the backend for the authenticated user.
 * @param {{value: number, timestamp: string}} measurementData - The new measurement, containing the value and an ISO timestamp.
 * @returns {Promise<{data: object|null, error: object|null}>} A promise that resolves to an object containing the newly created measurement data or an error object.
 */
export async function addGlucoseMeasurement(measurementData) {
    try {
        const { data } = await apiClient.post('/glucose', measurementData);
        return { data, error: null };
    } catch (error) {
        const formattedError = handleApiError(error);
        return { data: null, error: formattedError };
    }
}