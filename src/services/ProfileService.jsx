// src/services/ProfileService.jsx
import apiClient from './ApiClient';

export async function fetchProfile() {
    // Roept nu GET http://localhost:8000/users/profile
    const response = await apiClient.get('/users/profile');
    return response.data;
}

export default { fetchProfile };
