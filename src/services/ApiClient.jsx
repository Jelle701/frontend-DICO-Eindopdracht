// src/services/ApiClient.jsx
import axios from 'axios';
import { API_URL } from '../../config.js';

const apiClient = axios.create({
    baseURL: API_URL, // Gebruik de omgevingsvariabele
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});
/**
 * Request Interceptor:
 * Deze functie wordt uitgevoerd VOOR elke uitgaande request.
 */
apiClient.interceptors.request.use(
    (config) => {
        const delegatedToken = sessionStorage.getItem('delegatedToken');
        if (delegatedToken) {
            config.headers['Authorization'] = `Bearer ${delegatedToken}`;
        } else {
            const userToken = localStorage.getItem('token');
            if (userToken) {
                config.headers['Authorization'] = `Bearer ${userToken}`;
            }
        }
        console.log(`[API Request Interceptor] Request naar: ${config.method.toUpperCase()} ${config.url}`);
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
        console.log(`[API Response Interceptor] Response van: ${response.config.method.toUpperCase()} ${response.config.url}`, { status: response.status });
        return response;
    },
    (error) => {
        console.error(`[API Response Interceptor] Fout van: ${error.config.method.toUpperCase()} ${error.config.url}`, { error: error.response });
        return Promise.reject(error);
    }
);

export default apiClient;
