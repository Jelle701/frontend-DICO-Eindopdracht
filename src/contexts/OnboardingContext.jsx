/**
 * @file OnboardingContext.jsx
 * @description This context manages the state and logic for the multi-step user onboarding process. It collects
 * and persists user-provided data (preferences, medical info, devices) across different onboarding pages
 * using `sessionStorage`. Finally, it handles the transformation and submission of this data to the backend.
 *
 * @module OnboardingContext
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { submitOnboardingProfile } from '../services/OnboardingService';
import { useUser } from './AuthContext';

const OnboardingContext = createContext();

const SESSION_STORAGE_KEY = 'onboarding_data';

/**
 * The provider component for the OnboardingContext. It manages the onboarding data state,
 * persists it to sessionStorage, and provides functions to update and submit this data.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the provider.
 * @returns {JSX.Element} The OnboardingContext.Provider component.
 */
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

    /**
     * Persists the current onboarding data to sessionStorage whenever it changes.
     */
    useEffect(() => {
        try {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(onboardingData));
        } catch (error) {
            console.error("Failed to save onboarding data to sessionStorage", error);
        }
    }, [onboardingData]);

    /**
     * Updates a specific part of the onboarding data. It intelligently merges new data
     * with existing data, especially for nested objects.
     * @param {object} newData - An object containing the new data to be merged into the onboarding state.
     */
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

    /**
     * Submits the complete onboarding data to the backend. This function performs necessary data
     * transformations (e.g., mapping gender/unit values, calculating BMI) to match the backend's
     * expected payload structure. After successful submission, it clears the sessionStorage data
     * and updates the user state in AuthContext.
     * @param {object} finalPayload - The complete onboarding data collected from all steps.
     * @returns {Promise<object>} A promise that resolves with the updated user data from the backend.
     * @throws {Error} If validation fails or the backend submission encounters an error.
     */
    const submitOnboardingData = async (finalPayload) => {
        // --- DATA TRANSFORMATION ---
        const prefs = finalPayload.preferences || {};
        const medInfo = finalPayload.medicineInfo || {};

        const mapGenderToSystemValue = (gender) => {
            switch (gender) {
                case 'Man': return 'male';
                case 'Vrouw': return 'female';
                case 'Anders': return 'other';
                default: return 'prefer_not_to_say';
            }
        };

        const mapUnitToSystemValue = (unit) => {
            return (unit === 'mmol/L' || unit === 'mg/dL') ? 'metric' : 'metric'; // Assuming 'metric' as default/fallback
        };

        // 1. Create the flat object for the backend API.
        const flatProfileData = {
            role: finalPayload.role,
            system: mapUnitToSystemValue(prefs.eenheid),
            gender: mapGenderToSystemValue(prefs.geslacht),
            weight: parseFloat(prefs.gewicht) || 0,
            height: parseFloat(prefs.lengte) || 0,
            diabetesType: medInfo.diabetesType,
            longActingInsulin: medInfo.longActing?.insulin,
            shortActingInsulin: medInfo.shortActing?.insulin,
            diabeticDevices: finalPayload.diabeticDevices || [],
        };

        // 2. Calculate and add BMI.
        if (flatProfileData.weight > 0 && flatProfileData.height > 0) {
            const heightInMeters = flatProfileData.height / 100;
            flatProfileData.bmi = parseFloat((flatProfileData.weight / (heightInMeters * heightInMeters)).toFixed(1));
        } else {
            flatProfileData.bmi = 0;
        }

        // 3. Validate the final, flat payload.
        if (!flatProfileData.role) {
            const errorMessage = `Validation failed: 'role' is missing.`;
            console.error(errorMessage, flatProfileData);
            throw new Error("Fout bij validatie: De gebruikersrol is niet geselecteerd.");
        }

        console.log("Submitting flattened onboarding payload:", flatProfileData);

        // 4. Submit the data.
        const { data, error } = await submitOnboardingProfile(flatProfileData);

        if (error) {
            console.error("Backend rejected the payload. Full error:", error);
            throw new Error(error.message || 'Het opslaan van de onboarding-gegevens is mislukt.');
        }

        // 5. Clean up and update user state.
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

/**
 * Custom hook to consume the OnboardingContext. Provides access to the current onboarding data,
 * the function to update it, and the function to submit the final data.
 * @returns {{onboardingData: object, updateOnboardingData: Function, submitOnboardingData: Function}}
 */
export const useOnboarding = () => {
    return useContext(OnboardingContext);
};