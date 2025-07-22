// src/services/profileService.jsx
import apiClient from './ApiClient';

/**
 * Haalt het profiel van de ingelogde gebruiker op
 */
export async function fetchUserProfile() {
    try {
        const response = await apiClient.get('/profile');
        return response.data;
    } catch (err) {
        console.error('Error fetching profile:', err);
        throw err;
    }
}

/**
 * Update profielgegevens van de gebruiker
 * @param {Object} profileData
 */
export async function updateUserProfile(profileData) {
    try {
        const response = await apiClient.put('/profile', profileData);
        return response.data;
    } catch (err) {
        console.error('Error updating profile:', err);
        throw err;
    }
}