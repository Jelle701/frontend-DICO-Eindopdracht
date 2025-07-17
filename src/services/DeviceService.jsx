// src/services/DeviceService.jsx
import apiClient from './ApiClient';

export async function getDevices() {
    // Roept nu GET http://localhost:8000/users/devices
    const response = await apiClient.get('/users/devices');
    return response.data;
}

export default { getDevices };
