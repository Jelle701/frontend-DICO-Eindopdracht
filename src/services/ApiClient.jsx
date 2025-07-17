import axios from 'axios';

// Zorg dat VITE_API_URL wijst naar bv. 'http://localhost:8000'
// (zonder trailing slash en zonder /api)
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export default apiClient;