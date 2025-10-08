import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Functie voor de ingelogde patiënt (of via delegatie)
export const getDiabetesSummary = async () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const delegatedToken = sessionStorage.getItem('delegatedToken');
    const activeToken = delegatedToken || token;

    if (!activeToken) {
        throw new Error('Geen authenticatietoken gevonden.');
    }

    try {
        const response = await axios.get(`${API_URL}/diabetes/summary`, {
            headers: { 'Authorization': `Bearer ${activeToken}` },
        });
        return response.data;
    } catch (error) {
        console.error('Fout bij het ophalen van de diabetes samenvatting:', error.response || error.message);
        throw new Error(error.response?.data?.message || 'Kon de samenvattingsgegevens niet ophalen.');
    }
};

// Functie voor zorgverleners om data van een specifieke patiënt op te halen
export const getDiabetesSummaryForPatient = async (patientId) => {
    const token = localStorage.getItem('token'); // Zorgverleners gebruiken hun eigen token

    if (!token) {
        throw new Error('Geen authenticatietoken voor zorgverlener gevonden.');
    }

    try {
        // URL hersteld: /provider prefix weer toegevoegd om te matchen met de ProviderController
        const response = await axios.get(`${API_URL}/provider/patients/${patientId}/diabetes-summary`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Fout bij ophalen samenvatting voor patiënt ${patientId}:`, error.response || error.message);
        throw new Error(error.response?.data?.message || `Kon samenvatting voor patiënt ${patientId} niet ophalen.`);
    }
};
