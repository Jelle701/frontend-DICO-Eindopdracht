// src/services/GlucoseService.jsx
import apiClient from './ApiClient';

/**
 * A helper function to handle API errors and format the response.
 * This can be centralized in a utility file if used across multiple services.
 * @param {Error} error - The error object from the catch block.
 * @returns {{ data: null, error: { message: string, status: number|null } }}
 */
const handleError = (error) => {
    if (error.response) {
        const message = error.response.data?.message || 'Er is een serverfout opgetreden.';
        console.error("API Error:", error.response.data);
        return {
            data: null,
            error: {
                message,
                status: error.response.status,
            },
        };
    } else if (error.request) {
        console.error("Network Error:", error.request);
        return {
            data: null,
            error: { message: 'Netwerkfout. Controleer je verbinding.', status: null },
        };
    } else {
        console.error("Error:", error.message);
        return {
            data: null,
            error: { message: error.message, status: null },
        };
    }
};

/**
 * Haalt de recente glucosemetingen (laatste 90 dagen) op voor de ingelogde gebruiker.
 * @returns {Promise<{data: Array|null, error: object|null}>}
 */
export async function getRecentGlucoseMeasurements() {
    try {
        const { data } = await apiClient.get('/glucose');
        return { data, error: null };
    } catch (error) {
        return handleError(error);
    }
}

/**
 * Voegt een nieuwe glucosemeting toe voor de ingelogde gebruiker.
 * @param {{value: number, timestamp: string}} measurementData - De nieuwe meting.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function addGlucoseMeasurement(measurementData) {
    try {
        const { data } = await apiClient.post('/glucose', measurementData);
        return { data, error: null };
    } catch (error) {
        return handleError(error);
    }
}