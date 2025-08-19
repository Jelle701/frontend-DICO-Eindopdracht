// src/pages/Services/ServicesHubPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './ServicesHubPage.css';

function ServicesHubPage() {
    return (
        <>
            <Navbar />
            <div className="services-page-container">
                <header className="services-header">
                    <h1>Koppel Externe Services</h1>
                    <p>Automatiseer je data door je accounts van andere platformen te verbinden.</p>
                </header>

                <main className="services-grid">
                    <div className="service-card disabled">
                        <h3 className="service-card-title">Google Fit (Binnenkort)</h3>
                        <p className="service-card-description">
                            Synchroniseer je activiteits- en gezondheidsgegevens vanuit je Google account.
                        </p>
                        <button className="btn" disabled>
                            Binnenkort
                        </button>
                    </div>

                    <div className="service-card disabled">
                        <h3 className="service-card-title">Samsung Health (Binnenkort)</h3>
                        <p className="service-card-description">
                            Synchroniseer je activiteits- en gezondheidsgegevens vanuit je Samsung account.
                        </p>
                        <button className="btn" disabled>
                            Binnenkort
                        </button>
                    </div>

                    <div className="service-card disabled">
                        <h3 className="service-card-title">Dexcom (Binnenkort)</h3>
                        <p className="service-card-description">
                            Koppel je Dexcom account om je CGM data direct te importeren.
                        </p>
                        <button className="btn" disabled>
                            Binnenkort
                        </button>
                    </div>

                    <div className="service-card disabled">
                        <h3 className="service-card-title">FreeStyle Libre (Binnenkort)</h3>
                        <p className="service-card-description">
                            Koppel je FreeStyle Libre account om je CGM data direct te importeren.
                        </p>
                        <button className="btn" disabled>
                            Binnenkort
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
}

export default ServicesHubPage;
