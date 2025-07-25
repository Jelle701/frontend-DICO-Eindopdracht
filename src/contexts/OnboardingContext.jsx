// C:/Users/jelle/Desktop/School/EINDOPDRACHT/frontend/src/contexts/OnboardingContext.jsx

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { submitOnboardingProfile } from '../services/OnboardingService';
import { useUser } from './AuthContext';

const OnboardingContext = createContext();

const SESSION_STORAGE_KEY = 'onboarding_data';

export function OnboardingContextProvider({ children }) {
    const [onboardingData, setOnboardingData] = useState(() => {
        try {
            const storedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
            return storedData ? JSON.parse(storedData) : {
                preferences: {},
                medicineInfo: {},
                diabeticDevices: [],
            };
        } catch (error) {
            console.error("Failed to parse onboarding data from sessionStorage", error);
            return {
                preferences: {},
                medicineInfo: {},
                diabeticDevices: [],
            };
        }
    });

    const { setUser } = useUser();

    useEffect(() => {
        try {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(onboardingData));
        } catch (error) {
            console.error("Failed to save onboarding data to sessionStorage", error);
        }
    }, [onboardingData]);

    const updateOnboardingData = (newData) => {
        setOnboardingData(prevData => {
            const updatedData = { ...prevData };

            for (const key in newData) {
                if (typeof newData[key] === 'object' && !Array.isArray(newData[key]) && prevData[key]) {
                    updatedData[key] = { ...prevData[key], ...newData[key] };
                } else {
                    updatedData[key] = newData[key];
                }
            }
            return updatedData;
        });
    };

    const submitOnboardingData = async (finalData) => {
        const combinedData = {
            ...onboardingData,
            ...finalData,
        };

        const prefs = combinedData.preferences;
        let bmi = prefs.bmi;
        if (!bmi && prefs.gewicht > 0 && prefs.lengte > 0) {
            const lengteInMeters = prefs.lengte / 100;
            bmi = (prefs.gewicht / (lengteInMeters * lengteInMeters)).toFixed(1);
        }

        const mapGenderToSystemValue = (gender) => {
            switch (gender) {
                case 'Man': return 'male';
                case 'Vrouw': return 'female';
                case 'Anders': return 'other';
                default: return 'prefer_not_to_say';
            }
        };

        const mapUnitToSystemValue = (unit) => {
            if (unit === 'mmol/L' || unit === 'mg/dL') {
                return 'metric';
            }
            return 'metric';
        };

        const preferencesPayload = {
            system: mapUnitToSystemValue(prefs.eenheid),
            gender: mapGenderToSystemValue(prefs.geslacht),
            weight: parseFloat(prefs.gewicht) || 0,
            height: parseFloat(prefs.lengte) || 0,
            bmi: parseFloat(bmi) || 0,
        };

        // Maak een schone kopie van de medicatiegegevens voor de payload.
        // De 'gebruiktInsuline' eigenschap is alleen voor de frontend UI en wordt hier
        // verwijderd voordat de data naar de backend wordt gestuurd.
        const medicineInfoPayload = { ...(combinedData.medicineInfo || {}) };
        delete medicineInfoPayload.gebruiktInsuline;

        // Stel de uiteindelijke payload samen, inclusief de medische informatie.
        const payload = {
            preferences: preferencesPayload,
            medicineInfo: medicineInfoPayload, // TOEGEVOEGD
            diabeticDevices: combinedData.diabeticDevices,
        };

        // Validatie: controleer of de essentiële data aanwezig is
        if (!prefs.role) {
            const errorMessage = `Validation failed: 'role' is missing from the onboarding context.`;
            console.error(errorMessage, combinedData);
            throw new Error("Incomplete registration. The role was not selected.");
        }

        // Client-side validatie voor gewicht en lengte
        if (payload.preferences.weight <= 0) {
            throw new Error("Gewicht moet een positief getal zijn.");
        }
        if (payload.preferences.height <= 0) {
            throw new Error("Lengte moet een positief getal zijn.");
        }

        console.log("Submitting final onboarding payload:", payload);

        const { data, error } = await submitOnboardingProfile(payload);

        if (error) {
            console.error("Backend rejected the payload. Full error:", error);
            throw new Error(error.message || 'Failed to save onboarding data.');
        }

        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        setUser(data);
        return data;
    };

    const value = { onboardingData, updateOnboardingData, submitOnboardingData };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
}

export const useOnboarding = () => {
    return useContext(OnboardingContext);
};