// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,  // geen trailing slash
    withCredentials: true,                       // als je cookies/jwt wilt meesturen
});

apiClient.interceptors.request.use(req => {
    console.log('[API Request]', req.method, req.url);
    return req;
});


export default apiClient;

