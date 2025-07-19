import { apiClient } from './api'; // We importeren de bestaande api-client

/**
 * Functie om de profielgegevens van de ingelogde gebruiker op te halen.
 * @returns {Promise<object>} De profielgegevens van de gebruiker.
 * @throws {Error} Gooit een error als het ophalen van de gegevens mislukt.
 */
export const getProfile = async () => {
    try {
        // We halen de token op uit de lokale opslag, die nodig is voor autorisatie
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Geen token gevonden. Log opnieuw in.');
        }

        // We sturen een GET-verzoek naar het '/profile' endpoint van je backend
        // De 'Authorization' header is nodig zodat de backend weet wie je bent
        const response = await apiClient.get('/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // We geven de data uit het antwoord terug
        return response.data;
    } catch (error) {
        // Als er iets misgaat (bijv. netwerkfout of ongeldige token), loggen we de fout
        // en gooien we deze door, zodat de component die de functie aanroept weet dat het misging.
        console.error("Fout bij het ophalen van het profiel:", error);
        throw error;
    }
};