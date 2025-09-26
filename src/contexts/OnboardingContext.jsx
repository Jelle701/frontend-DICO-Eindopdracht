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

    const { setUserData } = useUser();

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

        const toInsulinEnum = (name) => {
            if (!name) return null;
            return name.toUpperCase().replace(/ /g, '_');
        }

        // DE FIX: Pas de payload aan om de nieuwe velden te reflecteren
        const flatProfileData = {
            role: finalData.role,
            firstName: prefs.firstName, // NIEUW
            lastName: prefs.lastName,   // NIEUW
            system: mapUnitToSystemValue(medInfo.eenheid), // VERPLAATST
            gender: mapGenderToSystemValue(prefs.geslacht),
            dateOfBirth: prefs.dateOfBirth,
            weight: parseFloat(prefs.gewicht) || 0,
            height: parseFloat(prefs.lengte) || 0,
            diabetesType: medInfo.diabetesType,
            longActingInsulin: toInsulinEnum(medInfo.longActing?.insulin),
            shortActingInsulin: toInsulinEnum(medInfo.shortActing?.insulin),
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

        console.log('%cFinal Onboarding Payload:', 'color: green; font-weight: bold;', flatProfileData);

        const { data, error } = await submitOnboardingProfile(flatProfileData);

        if (error) {
            console.error("Backend rejected the payload. Full error:", error);
            throw new Error(error.message || 'Het opslaan van de onboarding-gegevens is mislukt.');
        }

        setUserData(data);
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
