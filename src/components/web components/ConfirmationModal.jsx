import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmText = 'Bevestigen', cancelText = 'Annuleren' }) => {
    return (
        <div className="modal-overlay">
            <div className="confirmation-modal-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="btn btn--secondary">{cancelText}</button>
                    <button onClick={onConfirm} className="btn btn--danger">{confirmText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
