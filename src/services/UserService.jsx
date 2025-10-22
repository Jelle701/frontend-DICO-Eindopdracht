import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * Haalt de status van alle gekoppelde services voor de ingelogde gebruiker op.
 * @returns {Promise<{data: Array<object>|null, error: object|null}>}
 */
export async function getUserServices() {
    try {
        const { data } = await apiClient.get('/users/me/services');
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * Vraagt de backend om de verlopen LibreView-sessie te vernieuwen.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function refreshLibreViewSession() {
    try {
        const { data } = await apiClient.post('/libre/auth/refresh');
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}
