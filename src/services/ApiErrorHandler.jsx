/**
 * @file ApiErrorHandler.jsx
 * @description This file provides a centralized and consistent way to handle errors returned from the API.
 * It parses different error response formats and standardizes them into a single, predictable format that can be
 * easily consumed by the UI components.
 *
 * @module ApiErrorHandler
 */

/**
 * A centralized helper to parse different API error message formats.
 * It intelligently checks for various common error structures (e.g., an object with a message property,
 * a validation error object, or a plain string) and extracts the most relevant message.
 * @param {any} responseData - The `error.response.data` from an Axios error object.
 * @returns {string} A user-friendly error message string.
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
 * A centralized helper function to handle API errors and format them.
 * This function should be used in the .catch() block of service functions to ensure uniform error handling.
 * It distinguishes between server response errors, network errors, and request setup errors.
 * @param {Error} error - The error object from the catch block (typically an Axios error).
 * @returns {{ message: string, status: number|null }} A standardized error object containing a clean message and the HTTP status code.
 */
export const handleApiError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        console.error("API Error:", error.response.data);
        const message = parseApiErrorMessage(error.response.data);
        return { message, status: error.response.status };
    } else if (error.request) {
        // The request was made but no response was received
        console.error("Network Error:", error.request);
        return { message: 'Network error. Please check your connection.', status: null };
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Setup Error:", error.message);
        return { message: error.message, status: null };
    }
};