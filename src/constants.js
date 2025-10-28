/**
 * @file Centralized application constants.
 * This helps prevent bugs caused by typos and makes maintenance easier.
 */

/**
 * User roles used throughout the application.
 * Using constants for these values prevents typos and allows for easy updates.
 */
export const ROLES = {
    ADMIN: 'ADMIN',
    PATIENT: 'PATIENT',
    GUARDIAN: 'GUARDIAN',
    PROVIDER: 'PROVIDER',
};

/**
 * Sources of glucose measurements, to align with the backend entity.
 */
export const MeasurementSource = {
    LIBREVIEW: 'LIBREVIEW',
    MANUAL_UPLOAD: 'MANUAL_UPLOAD', // For CSV uploads
    MANUAL_ENTRY: 'MANUAL_ENTRY',   // For single form entries
};
