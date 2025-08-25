/**
 * @file GoogleHealthPage.jsx
 * @description This page provides detailed information about integrating the DICO application with Google Health.
 * It explains the benefits of the integration, how the connection process works, and includes a button to initiate
 * the connection. Currently, the connection logic is a placeholder.
 *
 * @component
 * @returns {JSX.Element} The rendered Google Health integration page.
 *
 * @functions
 * - `GoogleHealthPage()`: The main functional component that renders the page content.
 * - `handleConnect()`: A placeholder function that is called when the user clicks the "Connect with Google Health"
 *   button. It currently logs a message to the console and shows an alert, but is intended to house the logic for
 *   the Google Health API authentication and data synchronization process.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GoogleHealthPage.css';
import Navbar from '../../components/Navbar.jsx';

function GoogleHealthPage() {
    const navigate = useNavigate();

    const handleConnect = () => {
        // Logica voor het verbinden met Google Health API
        console.log("Verbinden met Google Health...");
        // Toon een succesbericht of navigeer naar een andere pagina
        alert("De verbinding met Google Health is succesvol gestart!");
    };

    return (
        <>
            <Navbar />
            <div className="google-health-page-container">
                <header className="google-health-header">
                    <h1>Integreer met Google Health</h1>
                    <p className="subtitle">Synchroniseer uw gezondheidsgegevens naadloos en veilig</p>
                </header>

                <div className="google-health-content">
                    <section className="introduction-section">
                        <h2>Wat is Google Health?</h2>
                        <p>
                            Google Health is een platform van Google dat erop gericht is om gezondheidsinformatie toegankelijker en nuttiger te maken. Door uw account te koppelen met Google Health, kunt u uw glucosegegevens en andere gezondheidsstatistieken centraal beheren en delen met uw zorgverleners of andere applicaties die u vertrouwt.
                        </p>
                    </section>

                    <section className="benefits-section">
                        <h2>De Voordelen van Integratie</h2>
                        <ul>
                            <li><strong>Gecentraliseerd Overzicht:</strong> Al uw gezondheidsgegevens, inclusief glucosemetingen, op één plek.</li>
                            <li><strong>Verbeterde Inzichten:</strong> Combineer data uit verschillende bronnen voor een completer beeld van uw gezondheid.</li>
                            <li><strong>Veilig Delen:</strong> U behoudt de volledige controle over welke gegevens u deelt en met wie.</li>
                            <li><strong>Noodgevallen:</strong> Maak cruciale gezondheidsinformatie beschikbaar voor hulpverleners in geval van nood.</li>
                        </ul>
                    </section>

                    <section className="how-it-works-section">
                        <h2>Hoe Werkt Het?</h2>
                        <ol>
                            <li><strong>Autorisatie:</strong> Klik op de "Verbind met Google Health" knop hieronder.</li>
                            <li><strong>Inloggen:</strong> U wordt doorgestuurd naar een beveiligde Google-pagina om in te loggen en toestemming te geven.</li>
                            <li><strong>Toestemming Geven:</strong> Selecteer welke gegevens u wilt synchroniseren. U kunt hierbij specifieke permissies instellen.</li>
                            <li><strong>Synchronisatie:</strong> Uw gegevens worden automatisch en veilig gesynchroniseerd.</li>
                        </ol>
                    </section>

                    <section className="connection-section">
                        <h2>Klaar om te Verbinden?</h2>
                        <p>Klik op de onderstaande knop om het autorisatieproces te starten. U wordt veilig doorgestuurd naar Google om toestemming te verlenen.</p>
                        <button onClick={handleConnect} className="btn btn-primary">
                            Verbind met Google Health
                        </button>
                    </section>
                </div>

                <div className="back-button-container">
                    <button onClick={() => navigate('/service-hub')} className="btn btn-outline">
                        &larr; Terug naar Service Hub
                    </button>
                </div>
            </div>
        </>
    );
}

export default GoogleHealthPage;
