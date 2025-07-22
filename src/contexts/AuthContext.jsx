import { createContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import apiClient from "../services/ApiClient";

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
    const [isAuth, setIsAuth] = useState({
        isAuthenticated: false,
        user: null,
        status: "pending",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            if (Math.floor(Date.now() / 1000) < decoded.exp) {
                login(token);
            } else {
                logout();
            }
        } else {
            setIsAuth({
                ...isAuth,
                status: 'done',
            });
        }
    }, []);

    async function login(token) {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);

        try {
            // Hier zou je een request kunnen doen om user details op te halen
            // Voor nu gebruiken we de data uit de token
            setIsAuth({
                isAuthenticated: true,
                user: {
                    email: decodedToken.email,
                    id: decodedToken.sub,
                    // Voeg andere velden toe die in je token zitten
                },
                status: "done",
            });
            console.log("Gebruiker is succesvol ingelogd!");
            navigate('/dashboard');
        } catch (e) {
            console.error("Fout bij ophalen van gebruikersdata na inloggen", e);
            // Zelfs bij een fout de state updaten om UI niet te blokkeren
            setIsAuth({
                isAuthenticated: false,
                user: null,
                status: 'done',
            });
        }
    }

    function logout() {
        localStorage.removeItem('token');
        setIsAuth({
            isAuthenticated: false,
            user: null,
            status: "done",
        });
        console.log("Gebruiker is succesvol uitgelogd!");
        navigate('/');
    }

    const contextData = {
        isAuth: isAuth.isAuthenticated,
        user: isAuth.user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {isAuth.status === 'pending' ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
}

export { AuthContextProvider };