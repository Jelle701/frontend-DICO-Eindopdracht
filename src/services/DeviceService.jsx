import apiClient from './ApiClient';

export async function getDevices() {
    // Roept GET http://localhost:8000/api/users/devices
    const { data } = await apiClient.get('/users/devices');
    return data;
}

export default { getDevices };
