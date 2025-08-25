/**
 * @file BypassRequiredFields.jsx
 * @description This development utility component is designed to bypass HTML5 `required` attribute validation
 * on form fields. It is intended for use during development and testing to quickly submit forms without
 * needing to fill in all required fields. It should only be active in a development environment.
 *
 * @component
 * @param {object} props - The component props.
 * @param {boolean} [props.active=false] - A boolean flag to activate or deactivate the bypass functionality.
 * @returns {null} This component does not render any UI elements.
 *
 * @functions
 * - `DevBypassValidation({ active })`: The functional component that contains the logic.
 * - `useEffect()`: A React hook that runs when the `active` prop changes. If `active` is true and the environment
 *   is development, it iterates through all `required` input, select, and textarea elements and removes their
 *   `required` attribute. It stores a custom data attribute (`_wasRequired`) to restore the attribute when the
 *   component unmounts or `active` becomes false.
 */
import { useEffect } from 'react';

function DevBypassValidation({ active = false }) {
    useEffect(() => {
        if (!import.meta.env.DEV || !active) return;

        const timer = setTimeout(() => {
            const elements = document.querySelectorAll('input[required], select[required], textarea[required]');
            elements.forEach(el => {
                el.dataset._wasRequired = 'true';
                el.removeAttribute('required');
                console.log(`[DevBypass] Removed 'required' from`, el);
            });
        }, 100); // Wait for inputs to be fully in the DOM

        return () => {
            clearTimeout(timer);
            const all = document.querySelectorAll('input, select, textarea');
            all.forEach(el => {
                if (el.dataset._wasRequired === 'true') {
                    el.setAttribute('required', '');
                    delete el.dataset._wasRequired;
                    console.log(`[DevBypass] Restored 'required' to`, el);
                }
            });
        };
    }, [active]);

    return null;
}

export default DevBypassValidation;
