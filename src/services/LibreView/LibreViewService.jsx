import apiClient from '../ApiClient';

// Helper om gedetailleerde fouten terug te geven
const handleApiError = (error, endpoint) => {
    const errorMessage = error.response?.data?.message || `Actie op ${endpoint} mislukt.`;
    console.error(`[LibreViewService] Fout bij ${endpoint}:`, error.response || error.message);
    return { data: null, error: { message: errorMessage, status: error.response?.status, data: error.response?.data } };
}

// --- SESSIE BEHEER ---

export const createLibreViewSession = async (email, password) => {
    try {
        const response = await apiClient.post('/libre/login', { email, password });
        return { data: response.data, error: null };
    } catch (error) {
        return handleApiError(error, '/libre/login');
    }
};

export const invalidateLibreViewSession = async () => {
    try {
        const response = await apiClient.delete('/libre/session');
        return { data: response.data, error: null };
    } catch (error) {
        return handleApiError(error, '/libre/session');
    }
};

// --- DATA OPHALEN VIA DE BACKEND PROXY ---

const getFromLibreProxy = async (endpoint, session) => {
    if (!session?.token || !session?.accountIdHash) {
        return { data: null, error: { message: 'Geen geldige LibreView-sessie in de frontend state.' } };
    }

    try {
        const response = await apiClient.get(endpoint, {
            headers: {
                'X-LibreView-Token': session.token,
                'X-LibreView-AccountId': session.accountIdHash,
            }
        });
        return { data: response.data, error: null };
    } catch (error) {
        return handleApiError(error, endpoint);
    }
};

// --- Specifieke Data Functies ---

export const getLibreViewConnections = (session) => {
    return getFromLibreProxy('/libre/connections', session);
};

export const getLibreViewGlucoseGraph = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/graph`, session);
};

export const getLibreViewGlucoseHistory = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/glucose/history`, session);
};

export const getLibreViewDevices = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/devices`, session);
};

export const getLibreViewFamily = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/family`, session);
};

export const getLibreViewNotes = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/notes`, session);
};

export const getLibreViewReportSettings = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/report-settings`, session);
};

export const getLibreViewAlarmSettings = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/alarm-settings`, session);
};

export const getLibreViewGlucoseTargets = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/glucose-targets`, session);
};

export const getLibreViewPrescriptions = (session) => {
    if (!session?.patientId) return { data: null, error: { message: 'PatientId niet gevonden in sessie.' } };
    return getFromLibreProxy(`/libre/connections/${session.patientId}/prescriptions`, session);
};

export const importHistoricalLibreViewData = async () => {
    try {
        const response = await apiClient.post('/libre/sync/historical');
        return { data: response.data, error: null };
    } catch (error) {
        return handleApiError(error, '/libre/sync/historical');
    }
};
