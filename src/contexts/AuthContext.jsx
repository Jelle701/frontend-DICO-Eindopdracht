/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../services/ApiClient"; // Gebruikt nu de versie met interceptor
import { fetchUserProfile } from "../services/ProfileService";
import { loginUser as apiLoginUser } from '../services/AuthService/AuthService';

export const AuthContext = createContext();
export const UserContext = createContext();

export function AuthContextProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Deze useEffect controleert alleen nog of er een token is om de initiële 'isAuth' state te bepalen.
    // De interceptor regelt de header.
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuth(true);
        }
        setLoading(false);
    }, []);

    // Deze login functie is nu flexibeler en schoner.
    async function login(credentialsOrToken) {
        setLoading(true);
        try {
            let token;

            // Case 1: Een token string wordt direct doorgegeven (van de verificatiepagina)
            if (typeof credentialsOrToken === 'string') {
                token = credentialsOrToken;
            }
            // Case 2: Een credentials object wordt doorgegeven (van de loginpagina)
            else {
                const { data, error } = await apiLoginUser(credentialsOrToken);
                if (error) throw new Error(error.message);
                token = data.token;
            }

            if (token) {
                // De ENIGE taak is de token opslaan. De interceptor doet de rest.
                localStorage.setItem("token", token);
                setIsAuth(true);
                navigate('/dashboard'); // Stuur door na succesvolle login/verificatie
            } else {
                throw new Error("Authenticatie mislukt: geen token ontvangen.");
            }

        } catch (err) {
            console.error("Authentication error:", err);
            logout(); // Zorg dat alles wordt opgeruimd bij een fout
            throw err; // Gooi de fout door zodat de component hem kan tonen
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        // Verwijder de token. De interceptor zal nu geen header meer toevoegen.
        localStorage.removeItem("token");
        // We verwijderen de header ook uit de actieve client voor de zekerheid,
        // hoewel dit technisch niet meer nodig is dankzij de interceptor.
        delete ApiClient.defaults.headers.common["Authorization"];
        setIsAuth(false);
        navigate('/login');
    }

    const authValue = { isAuth, loading, login, logout };

    return (
        <AuthContext.Provider value={authValue}>
            <UserContextProvider>
                {children}
            </UserContextProvider>
        </AuthContext.Provider>
    );
}

// UserContextProvider blijft ongewijzigd...
export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const { isAuth } = useAuth();

    useEffect(() => {
        if (isAuth) {
            fetchUserProfile()
                .then(profile => {
                    setUser(profile);
                })
                .catch((err) => {
                    console.error("Failed to fetch user profile", err);
                });
        } else {
            setUser(null);
        }
    }, [isAuth]);

    const userValue = { user, setUser };

    return (
        <UserContext.Provider value={userValue}>
            {children}
        </UserContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}

export function useUser() {
    return useContext(UserContext);
}
