// src/components/ButtonLink.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function ButtonLink({ to, children, variant = 'primary' }) {
    return (
        <Link to={to} className={`btn btn--${variant}`}>
            {children}
        </Link>
    );
}

export default ButtonLink;
