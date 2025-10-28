
import React, { useState, useEffect, useCallback } from 'react';
import { getMyGlucoseData } from '../../services/DataService.jsx';
import GlucoseUpload from '../../components/GlucoseUpload/GlucoseUpload.jsx';
// Importeer hier je grafiek, samenvatting en recente metingen componenten
// import GlucoseChart from '../../components/GlucoseChart/GlucoseChart.jsx';
// import GlucoseSummary from '../../components/GlucoseSummary/GlucoseSummary.jsx';
// import RecentMeasurements from '../../components/RecentMeasurements/RecentMeasurements.jsx';

function PatientDashboard() {
    const [glucoseData, setGlucoseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Functie om de data op te halen
    const fetchGlucoseData = useCallback(async () => {
        console.log('[PatientDashboard] Data wordt opgehaald...');
        setLoading(true);
        const { data, error: apiError } = await getMyGlucoseData();
        if (apiError) {
            console.error('[PatientDashboard] Fout bij ophalen data:', apiError);
            setError(apiError.message || 'Kon data niet ophalen.');
        } else {
            console.log('[PatientDashboard] Data succesvol ontvangen:', data);
            setGlucoseData(data || []);
            setError(null);
        }
        setLoading(false);
    }, []);

    // Haal de data op als de component voor het eerst laadt
    useEffect(() => {
        fetchGlucoseData();
    }, [fetchGlucoseData]);

    // Deze functie wordt aangeroepen door de GlucoseUpload component na een succesvolle upload
    const handleUploadSuccess = () => {
        console.log('[PatientDashboard] Upload succesvol! Data wordt opnieuw opgehaald.');
        fetchGlucoseData(); // Haal de data opnieuw op
    };

    return (
        <div className="container">
            <div className="section">
                <h1 className="mb-5">Patiëntendashboard</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Linker kolom voor grafiek en samenvatting */}
                    <div className="lg:col-span-2">
                        <div className="card mb-6">
                            <h2 className="card-title">Glucose Grafiek</h2>
                            {/* Vervang dit door je daadwerkelijke grafiek component */}
                            {/* <GlucoseChart data={glucoseData} loading={loading} error={error} /> */}
                            {loading && <p>Grafiek wordt geladen...</p>}
                            {!loading && !error && <p>{glucoseData.length} metingen beschikbaar voor de grafiek.</p>}
                            {error && <p className="form-error">{error}</p>}
                        </div>
                        <div className="card">
                             <h2 className="card-title">Samenvatting</h2>
                            {/* Vervang dit door je daadwerkelijke samenvatting component */}
                            {/* <GlucoseSummary data={glucoseData} /> */}
                             {loading && <p>Samenvatting wordt geladen...</p>}
                             {!loading && !error && <p>Samenvatting van {glucoseData.length} metingen.</p>}
                        </div>
                    </div>

                    {/* Rechter kolom voor upload en recente metingen */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="card">
                            <h2 className="card-title">Nieuwe Data Uploaden</h2>
                            <GlucoseUpload onUploadSuccess={handleUploadSuccess} />
                        </div>
                        <div className="card">
                            <h2 className="card-title">Recente Metingen</h2>
                            {/* Hier komt de lijst met recente metingen, die nu ook ververst wordt */}
                            {/* <RecentMeasurements data={glucoseData} loading={loading} /> */}
                            {loading && <p>Recente metingen worden geladen...</p>}
                            {!loading && !error && (
                                glucoseData.length > 0 ? (
                                    <ul>
                                        {glucoseData.slice(0, 5).map(d => <li key={d.id}>{d.value} mg/dL op {new Date(d.timestamp).toLocaleTimeString()}</li>)}
                                    </ul>
                                ) : <p>Geen data.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PatientDashboard;
