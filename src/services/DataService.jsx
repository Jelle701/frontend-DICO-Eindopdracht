
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * Uploadt een CSV-bestand met glucosegegevens.
 * @param {File} file - Het CSV-bestand dat moet worden geüpload.
 * @param {function} onUploadProgress - Callback-functie om de voortgang van het uploaden bij te houden.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function uploadGlucoseData(file, onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        };
        const { data } = await apiClient.post('/data/upload/glucose', formData, config);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * Haalt de recente glucosegegevens voor de ingelogde gebruiker op.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function getMyGlucoseData() {
    try {
        const { data } = await apiClient.get('/data/my-glucose-data');
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * Haalt ALLE glucosegegevens voor de ingelogde gebruiker op voor export.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function getAllMyGlucoseData() {
    try {
        const { data } = await apiClient.get('/data/my-glucose-data/all');
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}
