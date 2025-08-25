/**
 * @file ApiClient.jsx
 * @description This file configures and exports a central Axios instance for all API communications.
 * It sets the base URL for the API and includes a request interceptor to automatically attach the
 * appropriate authorization token to the headers of every outgoing request.
 *
 * @module ApiClient
 *
 * @functions
 * - `axios.create()`: Creates a new Axios instance with a predefined configuration, including the base URL
 *   from environment variables and default headers.
 * - `apiClient.interceptors.request.use()`: This interceptor is the core of the authentication handling.
 *   Before any request is sent, it checks for a `delegatedToken` (for caregivers) in `sessionStorage` first.
 *   If found, it's used. If not, it checks for the standard user `token` in `localStorage`. This ensures that
 *   the correct identity is used for API calls. It also includes a logging statement for debugging purposes.
 */
// src/services/ApiClient.jsx
import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', // Base URL for all requests
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

/**
 * Request Interceptor:
 * Deze functie wordt uitgevoerd VOOR elke uitgaande request.
 */
apiClient.interceptors.request.use(
    (config) => {
        // Prioriteit 1: Het tijdelijke token voor zorgverleners/ouders.
        const delegatedToken = sessionStorage.getItem('delegatedToken');

        if (delegatedToken) {
            config.headers['Authorization'] = `Bearer ${delegatedToken}`;
        } else {
            // Prioriteit 2: Het standaard token voor de ingelogde patiënt.
            const userToken = localStorage.getItem('token');
            if (userToken) {
                config.headers['Authorization'] = `Bearer ${userToken}`;
            }
        }

        // --- DEBUGGING STAP ---
        // Log de uitgaande request en de headers om te verifiëren dat het token wordt meegestuurd.
        console.log(`[API Interceptor] Request naar: ${config.url}`, {
            headers: config.headers
        });
        // --- EINDE DEBUGGING STAP ---

        return config;
    },
    (error) => {
        console.error("Fout bij opzetten van de request:", error);
        return Promise.reject(error);
    }
);

export default apiClient;
