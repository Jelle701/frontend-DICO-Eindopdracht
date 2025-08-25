/**
 * @file SignUpError.jsx
 * @description This component is intended to display specific errors related to the sign-up or registration process.
 * It is currently a placeholder and does not contain any specific implementation.
 *
 * @component
 * @param {object} props - The component props.
 * @param {string} props.message - The error message to be displayed.
 * @returns {JSX.Element|null} A component to render a sign-up error, or null if no message is provided.
 */
import React from 'react';

function SignUpError({ message }) {
    if (!message) {
        return null;
    }

    return (
        <div className="error-message signup-error">
            <p>{message}</p>
        </div>
    );
}

export default SignUpError;
