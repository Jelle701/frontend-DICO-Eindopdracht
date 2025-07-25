// src/services/ProfileService.jsx
import apiClient from './ApiClient';

/**
 * Haalt de volledige profielgegevens op van de ingelogde gebruiker.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function getMyProfile() {
    try {
        // Gebruikt de nieuwe GET endpoint zoals besproken voor de "Mijn Gegevens" pagina.
        const { data } = await apiClient.get('/profile/me');
        return { data, error: null };
    } catch (error) {
        console.error("API Error fetching profile data:", error.response?.data);
        return {
            data: null,
            error: {
                message: error.response?.data?.message || 'Kon profielgegevens niet ophalen.',
                status: error.response?.status,
            },
        };
    }
}

/**
 * Update de profielgegevens van de gebruiker.
 * Let op: Dit is voor algemene updates, niet voor de initiële onboarding.
 * @param {Object} profileData - De te updaten profielgegevens.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function updateUserProfile(profileData) {
    try {
        // De endpoint voor algemene updates kan verschillen van de onboarding endpoint.
        // We gebruiken hier /profile/details als een aanname. Pas aan indien nodig.
        const { data } = await apiClient.put('/profile/details', profileData);
        return { data, error: null };
    } catch (error) {
        console.error("API Error updating profile:", error.response?.data);
        return {
            data: null,
            error: {
                message: error.response?.data?.message || 'Kon profiel niet bijwerken.',
                status: error.response?.status,
            },
        };
    }
}