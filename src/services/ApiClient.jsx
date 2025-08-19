// src/services/ApiClient.jsx
import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

/**
 * Request Interceptor:
 * Deze functie wordt uitgevoerd VOOR elke uitgaande request.
 * Het doel is om de request te verrijken met de juiste authenticatietoken.
 * De logica geeft prioriteit aan het tijdelijke token voor zorgverleners.
 */
apiClient.interceptors.request.use(
    (config) => {
        // Prioriteit 1: Het tijdelijke token voor zorgverleners/ouders.
        // Dit wordt opgeslagen in sessionStorage en is alleen geldig voor de huidige browser-sessie.
        const delegatedToken = sessionStorage.getItem('delegated_token');

        // Prioriteit 2: Het standaard token voor de ingelogde patiënt.
        const userToken = localStorage.getItem('token');

        // Bepaal welk token gebruikt moet worden.
        const tokenToUse = delegatedToken || userToken;

        // Voeg de Authorization header alleen toe als er een token is.
        if (tokenToUse) {
            config.headers['Authorization'] = `Bearer ${tokenToUse}`;
        }

        // Geef de (mogelijk aangepaste) configuratie terug zodat de request kan doorgaan.
        return config;
    },
    (error) => {
        console.error("Fout bij opzetten van de request:", error);
        return Promise.reject(error);
    }
);

export default apiClient;
