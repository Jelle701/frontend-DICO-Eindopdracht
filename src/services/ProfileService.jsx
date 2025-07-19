// src/services/profileService.jsx
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Haalt het profiel van de ingelogde gebruiker op
 */
export async function fetchUserProfile() {
    try {
        const response = await axios.get(`${API_URL}/profile`, {
            withCredentials: true,
        });
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
        const response = await axios.put(`${API_URL}/profile`, profileData, {
            withCredentials: true,
        });
        return response.data;
    } catch (err) {
        console.error('Error updating profile:', err);
        throw err;
    }
}
