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
