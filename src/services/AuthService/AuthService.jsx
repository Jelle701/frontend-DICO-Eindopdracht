import apiClient from '../ApiClient';
import { handleApiError } from '../ApiErrorHandler';

/**
 * Registreert een nieuwe gebruiker.
 * @param {object} registrationData - De registratiegegevens (email, password).
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function registerUser(registrationData) {
    try {
        const { data } = await apiClient.post('/auth/register', registrationData);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * Logt een gebruiker in.
 * @param {object} loginPayload - De inloggegevens.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function loginUser(loginPayload) {
    console.log('AuthService: loginUser aangeroepen met payload:', loginPayload);
    try {
        // Correctie: Zorg ervoor dat de payload de key 'username' bevat, zoals de backend verwacht.
        const payload = {
            username: loginPayload.email, // Gebruik de 'email' uit de payload als 'username'
            password: loginPayload.password,
        };
        console.log('AuthService: Payload naar backend:', payload);
        const { data } = await apiClient.post('/auth/login', payload);
        console.log('AuthService: Reactie van backend:', data);
        return { data, error: null };
    } catch (error) {
        console.error('AuthService: Fout bij inloggen:', error.response || error.message);
        return { data: null, error: handleApiError(error) };
    }
}

/**
 * Verifieert de e-mail van een gebruiker met een token.
 * @param {object} verificationData - De verificatiegegevens (token).
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function verifyEmail(verificationData) {
    try {
        const { data } = await apiClient.post('/auth/verify', verificationData);
        return { data, error: null };
    } catch (error) {
        return { data: null, error: handleApiError(error) };
    }
}
