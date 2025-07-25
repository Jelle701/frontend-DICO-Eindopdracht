// src/services/AuthService/AuthService.jsx
import apiClient from '../ApiClient';

/**
 * A more robust helper to parse different API error message formats.
 * @param {any} responseData - The `error.response.data` from Axios.
 * @returns {string} A user-friendly error message.
 */
const parseApiErrorMessage = (responseData) => {
    if (!responseData) {
        return 'An unexpected server error occurred.';
    }
    // Case 1: The error is an object with a "message" property (e.g., { message: "..." })
    if (responseData.message && typeof responseData.message === 'string') {
        return responseData.message;
    }
    // Case 2: The error is an object of validation errors (e.g., { field: "error text" })
    if (typeof responseData === 'object') {
        // Get the first error message from the object's values
        const firstError = Object.values(responseData)[0];
        if (typeof firstError === 'string') {
            return firstError;
        }
    }
    // Case 3: The error is just a plain string
    if (typeof responseData === 'string') {
        return responseData;
    }
    // Fallback for any other cases
    return 'An unexpected server error occurred.';
};

/**
 * A helper function to handle API errors and format the response.
 * @param {Error} error - The error object from the catch block.
 * @returns {{ data: null, error: { message: string, status: number|null } }}
 */
const handleError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        console.error("API Error:", error.response.data);
        const message = parseApiErrorMessage(error.response.data); // Use the new parser
        return {
            data: null,
            error: {
                message, // This will now be the specific message from the backend
                status: error.response.status,
            },
        };
    } else if (error.request) {
        // The request was made but no response was received
        console.error("Network Error:", error.request);
        return {
            data: null,
            error: { message: 'Network error. Please check your connection.', status: null },
        };
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
        return {
            data: null,
            error: { message: error.message, status: null },
        };
    }
};


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
        return handleError(error);
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
        return handleError(error);
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
        return handleError(error);
    }
}




