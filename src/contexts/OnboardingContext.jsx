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

    const submitOnboardingData = async (devices) => {
        const finalData = {
            ...onboardingData,
            diabeticDevices: devices,
        };

        const prefs = finalData.preferences || {};
        const medInfo = finalData.medicineInfo || {};

        // --- DATA TRANSFORMATION ---
        const mapGenderToSystemValue = (gender) => {
            switch (gender) {
                case 'Man': return 'MALE';
                case 'Vrouw': return 'FEMALE';
                case 'Anders': return 'OTHER';
                default: return 'PREFER_NOT_TO_SAY';
            }
        };

        const mapUnitToSystemValue = (unit) => {
            return (unit === 'mmol/L' || unit === 'mg/dL') ? 'METRIC' : 'METRIC';
        };

        // Functie om de insuline naam om te zetten naar het backend enum formaat (bv. "Humulin R" -> "HUMULIN_R")
        const toInsulinEnum = (name) => {
            if (!name) return null;
            return name.toUpperCase().replace(/ /g, '_');
        }

        const flatProfileData = {
            role: finalData.role,
            system: mapUnitToSystemValue(prefs.eenheid),
            gender: mapGenderToSystemValue(prefs.geslacht),
            weight: parseFloat(prefs.gewicht) || 0,
            height: parseFloat(prefs.lengte) || 0,
            diabetesType: medInfo.diabetesType, // Is al in het juiste formaat (bv. 'TYPE_1')
            longActingInsulin: toInsulinEnum(medInfo.longActingInsulin),
            shortActingInsulin: toInsulinEnum(medInfo.shortActingInsulin),
            diabeticDevices: finalData.diabeticDevices || [],
        };

        if (flatProfileData.weight > 0 && flatProfileData.height > 0) {
            const heightInMeters = flatProfileData.height / 100;
            flatProfileData.bmi = parseFloat((flatProfileData.weight / (heightInMeters * heightInMeters)).toFixed(1));
        } else {
            flatProfileData.bmi = 0;
        }

        if (!flatProfileData.role) {
            const errorMessage = `Validation failed: 'role' is missing.`;
            console.error(errorMessage, finalData);
            throw new Error("Incomplete registration. The role was not selected.");
        }

        const { data, error } = await submitOnboardingProfile(flatProfileData);

        if (error) {
            console.error("Backend rejected the payload. Full error:", error);
            throw new Error(error.message || 'Het opslaan van de onboarding-gegevens is mislukt.');
        }

        setUser(data);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
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
