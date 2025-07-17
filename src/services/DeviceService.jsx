// src/services/deviceService.js
import apiClient from './apiClient';

/**
 * Haalt apparaten op gekoppeld aan een gebruiker.
 * @param {string} userId
 * @returns {Promise<Array>} lijst van apparaten
 */
export async function getDevices(userId) {
    const response = await apiClient.get(`/users/${userId}/devices`);
    return response.data;
}

/**
 * Voegt een nieuw apparaat toe voor een gebruiker.
 * @param {string} userId
 * @param {object} deviceData
 * @returns {Promise<object>} toegevoegde apparaatgegevens
 */
export async function addDevice(userId, deviceData) {
    const response = await apiClient.post(`/users/${userId}/devices`, deviceData);
    return response.data;
}
