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
        console.log(`[API Request Interceptor] Request naar: ${config.method.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data
        });
        // --- EINDE DEBUGGING STAP ---

        return config;
    },
    (error) => {
        console.error("[API Request Interceptor] Fout bij opzetten van de request:", error);
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor:
 * Deze functie wordt uitgevoerd NA elke inkomende response.
 */
apiClient.interceptors.response.use(
    (response) => {
        // --- DEBUGGING STAP ---
        // Log de inkomende response.
        console.log(`[API Response Interceptor] Response van: ${response.config.method.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data
        });
        // --- EINDE DEBUGGING STAP ---
        return response;
    },
    (error) => {
        // --- DEBUGGING STAP ---
        // Log de fout response.
        console.error(`[API Response Interceptor] Fout van: ${error.config.method.toUpperCase()} ${error.config.url}`, {
            error: error.response ? {
                status: error.response.status,
                data: error.response.data
            } : { message: error.message }
        });
        // --- EINDE DEBUGGING STAP ---
        return Promise.reject(error);
    }
);

export default apiClient;
