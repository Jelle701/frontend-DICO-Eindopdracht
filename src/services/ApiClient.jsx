// src/services/ApiClient.jsx
import axios from 'axios';

// Creëer een centrale, vooraf geconfigureerde Axios instance voor de hele applicatie.
const apiClient = axios.create({
    // Haal de basis-URL van de API uit de environment variables.
    // Dit maakt het makkelijk om te wisselen tussen ontwikkel-, test- en productieomgevingen.
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',

    // Stel standaard headers in die voor de meeste requests gelden.
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

/**
 * Request Interceptor:
 * Deze functie wordt uitgevoerd VOOR elke uitgaande request.
 * Het doel is om de request te verrijken met de authenticatietoken.
 */
apiClient.interceptors.request.use(
    (config) => {
        // Haal de token op uit localStorage.
        const token = localStorage.getItem('token');

        // Voeg de Authorization header alleen toe als er een token bestaat.
        // Dit voorkomt het versturen van een ongeldige header zoals 'Bearer null'.
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Geef de (mogelijk aangepaste) configuratie terug zodat de request kan doorgaan.
        return config;
    },
    (error) => {
        // Als er een fout optreedt bij het opzetten van de request, wordt deze hier afgevangen.
        // Dit is zeldzaam, maar kan gebeuren bijv. door een netwerkprobleem.
        console.error("Fout bij opzetten van de request:", error);
        return Promise.reject(error);
    }
);

export default apiClient;