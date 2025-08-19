import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HealthConnectPage.css';

const HealthConnectPage = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authenticatietoken niet gevonden. Log opnieuw in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8000/api/health-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHealthData(response.data);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Sessie verlopen of ongeldig. Log alstublieft opnieuw in.');
        } else {
          setError('Fout bij het ophalen van gezondheidsgegevens. Zorg ervoor dat data gesynchroniseerd is via de mobiele app.');
        }
        console.error("Fout bij het ophalen van health data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p>Gezondheidsgegevens worden geladen...</p>;
    }

    if (error) {
      return <p className="error-message">{error}</p>;
    }

    if (!healthData || (!healthData.stepsLast7Days?.length && !healthData.latestHeartRate)) {
      return (
        <div className="data-placeholder">
          <p>Geen gegevens om weer te geven. Zorg ervoor dat uw gegevens zijn gesynchroniseerd via de mobiele app.</p>
        </div>
      );
    }

    return (
      <div className="health-data-grid">
        {healthData.latestHeartRate && (
          <div className="data-card heart-rate-card">
            <h3>Meest Recente Hartslag</h3>
            <p className="heart-rate-value">{healthData.latestHeartRate.value} <span>BPM</span></p>
            <p className="timestamp">Gemeten op: {new Date(healthData.latestHeartRate.timestamp).toLocaleString()}</p>
          </div>
        )}

        {healthData.stepsLast7Days && healthData.stepsLast7Days.length > 0 && (
          <div className="data-card steps-card">
            <h3>Stappen (laatste 7 dagen)</h3>
            <ul>
              {healthData.stepsLast7Days.map((day) => (
                <li key={day.date}>
                  <span>{new Date(day.date).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}:</span>
                  <strong>{day.steps.toLocaleString('nl-NL')} stappen</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="health-connect-container">
      <h1>Health Connect Dashboard</h1>
      {renderContent()}
    </div>
  );
};

export default HealthConnectPage;
