import React, { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext.jsx';
import Navbar from 'src/components/Navbar.jsx';
import './DashboardPage.css';

function DashboardPage() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return (
            <div>
                <Navbar />
                <div className="dashboard-container">
                    <p>Gebruikersdata wordt geladen...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h1>Welkom terug, {user.firstName || user.email}!</h1>
                    <p>Hier is een overzicht van je recente activiteit.</p>
                </header>

                <main className="dashboard-main">
                    <div className="glucose-summary">
                        {/* Dit is een goed voorbeeld voor de .glucose-summary class */}
                        10.2
                    </div>

                    <div className="dashboard-widgets"> {/* Container voor de widgets */}
                        <section className="widget-card"> {/* Gebruik van .widget-card */}
                            <h2>Mijn Medicatie</h2>
                            <p>Geplande doseringen komen hier.</p>
                        </section>
                        <section className="widget-card"> {/* Gebruik van .widget-card */}
                            <h2>Mijn Profiel</h2>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Gebruikers ID:</strong> {user.id}</p>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashboardPage;