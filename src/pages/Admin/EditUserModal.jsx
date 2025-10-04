import React, { useState, useEffect } from 'react';
import { updateUserById } from '../../services/AdminService';
import './EditUserModal.css';

const EditUserModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        role: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                role: user.role
            });
        }
    }, [user]);

    if (!user) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { data, error: apiError } = await updateUserById(user.id, formData);

        if (apiError) {
            setError(apiError.message || 'Kon gebruiker niet bijwerken.');
            setLoading(false);
        } else {
            onSave(data); // Pass the updated user data back
            onClose(); // Close the modal on success
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Gebruiker Bewerken</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="firstName">Voornaam</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="lastName">Achternaam</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="role">Rol</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange}>
                            <option value="PATIENT">Patiënt</option>
                            <option value="GUARDIAN">Ouder / Voogd</option>
                            <option value="PROVIDER">Zorgverlener</option>
                            {/* Admins can't have their role changed from the frontend based on backend rules */}
                            {user.role === 'ADMIN' && <option value="ADMIN">Admin</option>}
                        </select>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} disabled={loading} className="btn btn--secondary">Annuleren</button>
                        <button type="submit" disabled={loading} className="btn btn--primary">{loading ? 'Opslaan...' : 'Opslaan'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
