import axios from 'axios';

VITE_API_URL = 'http://localhost:8000/api'


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export default apiClient;