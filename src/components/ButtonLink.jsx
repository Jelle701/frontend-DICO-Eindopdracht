/**
 * @file ButtonLink.jsx
 * @description A reusable component that renders a `react-router-dom` `<Link>` styled as a button.
 * This component helps maintain a consistent look and feel for navigational elements that should appear as buttons.
 *
 * @component
 * @param {object} props - The component props.
 * @param {string} props.to - The path to link to.
 * @param {React.ReactNode} props.children - The content to be displayed inside the button link (e.g., text).
 * @param {string} [props.variant='primary'] - The button style variant (e.g., 'primary', 'secondary', 'outline').
 * @returns {JSX.Element} A Link component styled as a button.
 */
import React from 'react';
import { Link } from 'react-router-dom';

function ButtonLink({ to, children, variant = 'primary' }) {
    return (
        <Link to={to} className={`btn btn-${variant}`}>
            {children}
        </Link>
    );
}

export default ButtonLink;
