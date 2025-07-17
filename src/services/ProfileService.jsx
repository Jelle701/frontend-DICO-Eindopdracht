import apiClient from './ApiClient';

export async function fetchProfile() {
    // Roept GET http://localhost:8000/api/users/profile
    const { data } = await apiClient.get('/users/profile');
    return data;
}
export default  fetchProfile;

export async function register(userData) {
    // POST naar http://localhost:8000/api/users/register
    const {data} = await apiClient.post('/users/register', userData);
    return data;
}