import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import './DashboardPage.css';

function DashboardPage() {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h1>Welkom terug, {user?.email || 'Gebruiker'}!</h1>
                    <p>Hier is een overzicht van je recente activiteit.</p>
                </header>

                <main className="dashboard-main">
                    <section className="dashboard-widget">
                        <h2>Mijn Glucose</h2>
                        <p>Recente metingen komen hier.</p>
                    </section>
                    <section className="dashboard-widget">
                        <h2>Mijn Medicatie</h2>
                        <p>Geplande doseringen komen hier.</p>
                    </section>
                    <section className="dashboard-widget">
                        <h2>Mijn Profiel</h2>
                        <p>Email: {user?.email}</p>
                        <p>Gebruikers ID: {user?.id}</p>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default DashboardPage;