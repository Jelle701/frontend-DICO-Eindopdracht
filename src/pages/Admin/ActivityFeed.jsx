import React from 'react';
import './ActivityFeed.css';

// Mock data for recent activities
const mockActivities = [
    {
        id: 1,
        type: 'USER_REGISTRATION',
        description: 'Nieuwe gebruiker \'patient@example.com\' heeft zich geregistreerd.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    },
    {
        id: 2,
        type: 'USER_DELETION',
        description: 'Gebruiker \'oud-gebruiker@example.com\' is verwijderd door een admin.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
        id: 3,
        type: 'ROLE_CHANGE',
        description: 'De rol van \'zorg@example.com\' is gewijzigd naar PROVIDER.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    },
];

// Helper to determine icon based on activity type
const getActivityIcon = (type) => {
    switch (type) {
        case 'USER_REGISTRATION': return '👤'; // Person icon
        case 'USER_DELETION': return '🗑️'; // Trash can icon
        case 'ROLE_CHANGE': return '🔄'; // Cycle icon
        default: return '🔔'; // Bell icon
    }
};

const TimeAgo = ({ timestamp }) => {
    const time = new Date(timestamp);
    const seconds = Math.floor((new Date() - time) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " jaar geleden";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " maanden geleden";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dagen geleden";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " uur geleden";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minuten geleden";
    return Math.floor(seconds) + " seconden geleden";
};

const ActivityFeed = () => {
    // In a real app, this data would come from props or a hook: `const { activities, loading } = useActivityFeed();`
    const activities = mockActivities;

    return (
        <div className="activity-feed-card">
            <h4>Recente Activiteit</h4>
            <ul className="activity-list">
                {activities.map(activity => (
                    <li key={activity.id} className="activity-item">
                        <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                        <div className="activity-details">
                            <p className="activity-description">{activity.description}</p>
                            <span className="activity-timestamp"><TimeAgo timestamp={activity.timestamp} /></span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityFeed;
