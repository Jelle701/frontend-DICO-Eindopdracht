// src/services/ApiClient.jsx
import axios from 'axios';

// Creëer een centrale Axios instance.
// Alle API-requests in de applicatie moeten deze instance gebruiken.
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Je backend basis-URL
    withCredentials: true,
});

// Request Interceptor: Dit wordt uitgevoerd VOOR elke request.
apiClient.interceptors.request.use(
    (config) => {
        // Haal de token op uit localStorage.
        const token = localStorage.getItem('token');

        // BELANGRIJKE FIX:
        // Voeg de Authorization header ALLEEN toe als er een token bestaat.
        // Dit voorkomt het versturen van 'Bearer null' of 'Bearer undefined'.
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handel eventuele request-fouten hier af.
        return Promise.reject(error);
    }
);

export default apiClient;