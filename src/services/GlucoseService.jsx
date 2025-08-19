// src/services/GlucoseService.jsx
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler'; // Gebruik de centrale error handler

/**
 * Haalt de recente glucosemetingen (laatste 90 dagen) op van je eigen backend.
 * @returns {Promise<{data: Array|null, error: object|null}>}
 */
export async function getRecentGlucoseMeasurements() {
    try {
        const { data } = await apiClient.get('/glucose');
        return { data, error: null };
    } catch (error) {
        // Gebruik de centrale handler voor consistente foutafhandeling.
        return handleApiError(error);
    }
}

/**
 * Voegt een nieuwe, handmatige glucosemeting toe aan je eigen backend.
 * @param {{value: number, timestamp: string}} measurementData - De nieuwe meting.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function addGlucoseMeasurement(measurementData) {
    try {
        const { data } = await apiClient.post('/glucose', measurementData);
        return { data, error: null };
    } catch (error) {
        // Gebruik de centrale handler voor consistente foutafhandeling.
        return handleApiError(error);
    }
}