// src/services/profileService.js
import apiClient from './apiClient';

/**
 * Haalt het profiel op van een gebruiker.
 * @param {string} userId
 * @returns {Promise<object>} profielgegevens
 */
export async function fetchProfile(userId) {
    const response = await apiClient.get(`/users/${userId}/profile`);
    return response.data;
}

/**
 * Werkt het profiel bij van een gebruiker.
 * @param {string} userId
 * @param {object} profileData
 * @returns {Promise<object>} bijgewerkte profielgegevens
 */
export async function updateProfile(userId, profileData) {
    const response = await apiClient.put(`/users/${userId}/profile`, profileData);
    return response.data;
}

