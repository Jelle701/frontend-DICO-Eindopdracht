// src/services/AuthService/AuthService.jsx
import apiClient from '../ApiClient';
import { handleApiError } from '../ApiErrorHandler'; // Importeer de centrale handler

/**
 * Registers a new user.
 * @param {object} userData - The user's registration data (e.g., name, email, password).
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function registerUser(userData) {
    try {
        const { data } = await apiClient.post('/auth/register', userData);
        return { data, error: null };
    } catch (error) {
        const formattedError = handleApiError(error);
        return { data: null, error: formattedError }; // Correctly wrap the error
    }
}

/**
 * Logs in a user.
 * @param {object} credentials - The user's login credentials (e.g., email, password).
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function loginUser(credentials) {
    try {
        const { data } = await apiClient.post('/auth/login', credentials);
        return { data, error: null };
    } catch (error) {
        const formattedError = handleApiError(error);
        return { data: null, error: formattedError }; // Correctly wrap the error
    }
}

/**
 * Verifies a user's email with a token.
 * @param {object} verificationData - The verification data (e.g., token, userId).
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function verifyEmail(verificationData) {
    try {
        const { data } = await apiClient.post('/auth/verify-email', verificationData);
        return { data, error: null };
    } catch (error) {
        const formattedError = handleApiError(error);
        return { data: null, error: formattedError }; // Correctly wrap the error
    }
}