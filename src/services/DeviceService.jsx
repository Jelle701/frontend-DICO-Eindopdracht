/**
 * @file DeviceService.jsx
 * @description This service is responsible for API communications related to a user's diabetic devices.
 * It provides functions to fetch the devices linked to a user's account.
 *
 * @module DeviceService
 */
import apiClient from './ApiClient';
import { handleApiError } from './ApiErrorHandler';

/**
 * Retrieves the list of diabetic devices associated with the currently authenticated user.
 * @returns {Promise<{data: Array|null, error: object|null}>} A promise that resolves to an object containing an array of the user's devices or an error object.
 */
export async function getDevices() {
    try {
        const { data } = await apiClient.get('/users/devices');
        return { data, error: null };
    } catch (error) {
        const formattedError = handleApiError(error);
        return { data: null, error: formattedError };
    }
}
