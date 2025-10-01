import React, { useMemo } from 'react';
import './AnalyticsCharts.css';

// This is a placeholder for a real charting library like Chart.js or Recharts
const ChartPlaceholder = ({ title, description }) => (
    <div className="chart-placeholder">
        <h4>{title}</h4>
        <div className="chart-content">
            <p>{description}</p>
            <span>(Grafiek wordt hier weergegeven)</span>
        </div>
    </div>
);

const AnalyticsCharts = ({ users }) => {

    // Memoized calculation for user registrations over time
    const registrationData = useMemo(() => {
        const counts = {};
        users.forEach(user => {
            const date = new Date(user.createdAt).toLocaleDateString('nl-NL', { month: 'short', year: 'numeric' });
            counts[date] = (counts[date] || 0) + 1;
        });
        // Here you would format the data for the charting library
        return `Data prepared for ${Object.keys(counts).length} months.`;
    }, [users]);

    // Memoized calculation for role distribution
    const roleDistributionData = useMemo(() => {
        const counts = {
            PATIENT: 0,
            GUARDIAN: 0,
            PROVIDER: 0,
            ADMIN: 0
        };
        users.forEach(user => {
            if (counts[user.role] !== undefined) {
                counts[user.role]++;
            }
        });
        // Here you would format the data for a pie chart
        return `PATIENT: ${counts.PATIENT}, GUARDIAN: ${counts.GUARDIAN}, PROVIDER: ${counts.PROVIDER}`;
    }, [users]);

    return (
        <div className="analytics-container">
            <ChartPlaceholder 
                title="Gebruikersregistraties per Maand"
                description={registrationData}
            />
            <ChartPlaceholder 
                title="Verdeling van Gebruikersrollen"
                description={roleDistributionData}
            />
        </div>
    );
};

export default AnalyticsCharts;
