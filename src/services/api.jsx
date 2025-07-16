const API_BASE = import.meta.env.VITE_API_URL;

export async function registerUser(userData) {
    const response = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Registratie mislukt');
    }

    return await response.json();
}
