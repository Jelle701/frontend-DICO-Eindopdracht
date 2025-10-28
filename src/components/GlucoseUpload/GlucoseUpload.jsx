
import React, { useState, useRef } from 'react';
import { uploadGlucoseData } from '../../services/DataService.jsx';
import '../../pages/service/ServicesHubPage.css'; // Importeer de CSS

function GlucoseUpload({ onUploadSuccess }) { // Accepteer de callback functie als prop
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log('[GlucoseUpload] Bestand geselecteerd:', selectedFile ? selectedFile.name : 'Geen bestand');
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
            setSuccess(false);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('[GlucoseUpload] handleSubmit aangeroepen.');
        if (!file) {
            console.log('[GlucoseUpload] Geen bestand geselecteerd.');
            setError('Selecteer een bestand om te uploaden.');
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setError(null);
        setSuccess(false);

        const onUploadProgress = (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
        };

        console.log('[GlucoseUpload] Starten met uploaden van bestand:', file.name);
        const { data, error: apiError } = await uploadGlucoseData(file, onUploadProgress);

        setUploading(false);

        if (apiError) {
            console.error('[GlucoseUpload] Fout bij uploaden:', apiError);
            setError(apiError.message || 'Er is een fout opgetreden bij het uploaden.');
            setSuccess(false);
        } else {
            console.log('[GlucoseUpload] Upload succesvol:', data);
            setSuccess(true);
            setFile(null);
            // Roep de callback functie aan als deze bestaat
            if (onUploadSuccess) {
                console.log('[GlucoseUpload] onUploadSuccess callback wordt aangeroepen.');
                onUploadSuccess();
            }
        }
        console.log('[GlucoseUpload] handleSubmit voltooid.');
    };

    return (
        <form onSubmit={handleSubmit} style={{width: '100%'}}>
            <a href="/glucose_template.csv" download className="btn btn--outline mb-4">Download Template</a>

            <div className="form-group mb-4">
                <div className="file-input-container">
                    <button type="button" onClick={handleButtonClick} className="btn btn--secondary">Kies Bestand</button>
                    <span className="file-name">{file ? file.name : 'Geen bestand gekozen'}</span>
                </div>
                <input 
                    type="file" 
                    id="glucoseFile" 
                    onChange={handleFileChange} 
                    accept=".csv" 
                    ref={fileInputRef} 
                    className="file-input-hidden" 
                />
            </div>

            {uploading && (
                <div className="mt-4">
                    <p>Uploaden... {uploadProgress}%</p>
                    <div style={{ width: '100%', backgroundColor: 'var(--gray-700)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ width: `${uploadProgress}%`, height: '8px', backgroundColor: 'var(--color-teal)', borderRadius: 'var(--radius-sm)' }}></div>
                    </div>
                </div>
            )}

            {error && <p className="form-error mt-4">{error}</p>}
            {success && <p className="form-success mt-4" style={{color: 'var(--color-success)'}}>Bestand succesvol geüpload! De dashboard data wordt ververst.</p>}

            <button type="submit" className="btn btn--primary mt-5" disabled={!file || uploading}>
                {uploading ? 'Bezig met uploaden...' : 'Uploaden'}
            </button>
        </form>
    );
}

export default GlucoseUpload;
