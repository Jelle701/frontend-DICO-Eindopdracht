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
        }, 100); // Wacht tot inputs volledig in de DOM staan

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
