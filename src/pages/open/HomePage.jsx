import React from 'react';
import { Link } from "react-router-dom";
import Navbar from '../../components/web components/Navbar.jsx';
import './HomePage.css';

// Importeer je afbeeldingen en video's hier
import heroVideo from '../../content/HomepageVideo.mp4';
import manWithSensor from '../../content/Man met sensor.png'; // Voorbeeld afbeelding
import graphImage from '../../content/Grafiek.png'; // Voorbeeld afbeelding
import fatimaImage from '../../content/fatima.png';
import marcoImage from '../../content/marco.png';
import sophieImage from '../../content/sophie.png';

function HomePage() {
    return (
        <div className="homepage">
            <div className="top-banner">
                <p>
                    De nieuwe DICO ervaring is hier!{' '}
                    <a href="#" className="top-banner-link">Bekijk de video</a>
                </p>
            </div>
            <Navbar />

            <header className="hero-section container"> {/* TOEGEVOEGD: container class */}
                <video src={heroVideo} autoPlay muted loop className="hero-video" />
                <div className="hero-content"> {/* VERWIJDERD: container class */}
                    <h1>Optimaliseer je gezondheid. Leef met vertrouwen.</h1>
                    <p className="hero-tagline">DICO: Jouw persoonlijke AI-coach voor diabetesmanagement.</p>
                    <Link to="/register" className="btn btn--primary">
                        Begin Vandaag Gratis
                    </Link>
                    <div className="hero-highlights d-flex gap-5 flex-wrap justify-center mt-6">
                        <span className="small text-300">Realtime Inzicht</span>
                        <span className="small text-300">Gepersonaliseerde Aanbevelingen</span>
                        <span className="small text-300">Veilig Delen</span>
                    </div>
                </div>
            </header>

            <section id="features" className="features-section container">
                <div className="features-grid">
                    <div className="feature-text">
                        <h2>Volledige controle over je glucosewaarden</h2>
                        <p>DICO integreert naadloos met je glucosemeters en sensoren, zodat je een compleet overzicht hebt van je bloedsuikerspiegel. Begrijp patronen en reageer proactief.</p>
                        <ul>
                            <li>Realtime data-synchronisatie.</li>
                            <li>Interactieve grafieken en trends.</li>
                            <li>Waarschuwingen bij afwijkende waarden.</li>
                        </ul>
                    </div>
                    <div className="feature-image-wrapper">
                        <img className="feature-img" src={manWithSensor} alt="Man met een glucose sensor" />
                    </div>
                </div>

                <div className="features-grid reverse">
                    <div className="feature-text">
                        <h2>Gepersonaliseerd Medicatiebeheer</h2>
                        <p>Ontvang slimme herinneringen voor je insuline en andere medicatie. DICO leert van je routine en past zich aan jouw leven aan.</p>
                        <ul>
                            <li>Aanpasbare medicatieschema's.</li>
                            <li>Dosis-tracking en rapportage.</li>
                            <li>Integratie met maaltijdplanning.</li>
                        </ul>
                    </div>
                    <div className="feature-image-wrapper">
                        <img className="feature-img" src={graphImage} alt="Grafiek van glucosewaarden" />
                    </div>
                </div>

                <div className="features-grid">
                    <div className="feature-text">
                        <h2>Jouw levensstijl, jouw controle.</h2>
                        <p>Registreer je voeding, beweging en slaap om te zien hoe deze factoren je glucose beïnvloeden. Ontdek correlaties en maak gezondere keuzes.</p>
                        <ul>
                            <li>Voedingsdagboek met macro-analyse.</li>
                            <li>Activiteiten-tracking en doelen.</li>
                            <li>Slaapkwaliteit monitoring.</li>
                        </ul>
                    </div>
                    <div className="feature-image-wrapper">
                        <img className="feature-img" src={graphImage} alt="DICO app op telefoon" /> {/* Gebruikt nu Grafiek.png als placeholder */} 
                    </div>
                </div>
            </section>

            <section className="data-impact-section section">
                <div className="container text-center">
                    <h2>DICO in Cijfers</h2>
                    <p className="auth-form-description">Ontdek de impact die DICO heeft op het leven van onze gebruikers.</p>
                    <div className="metrics-grid d-flex gap-6 justify-center flex-wrap mt-6">
                        <div className="metric-card card">
                            <div className="numeric stat">85%</div>
                            <p className="small text-300">Stabielere glucosewaarden</p>
                        </div>
                        <div className="metric-card card">
                            <div className="numeric stat">2 uur</div>
                            <p className="small text-300">Minder tijd aan handmatige logging</p>
                        </div>
                        <div className="metric-card card">
                            <div className="numeric stat">92%</div>
                            <p className="small text-300">Zorgverleners bevelen DICO aan</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="how-it-works-section section">
                <div className="container text-center">
                    <h2>Hoe DICO werkt</h2>
                    <p className="auth-form-description">Begin in slechts een paar eenvoudige stappen met het optimaliseren van je gezondheid.</p>
                    <div className="how-it-works-grid d-flex gap-6 flex-wrap justify-center mt-6">
                        <div className="how-it-works-step card">
                            <div className="step-number numeric">1</div>
                            <h3>Registreer</h3>
                            <p className="small text-300">Maak snel en eenvoudig je persoonlijke DICO-account aan.</p>
                        </div>
                        <div className="how-it-works-step card">
                            <div className="step-number numeric">2</div>
                            <h3>Koppel</h3>
                            <p className="small text-300">Verbind je glucosemeters en andere hulpmiddelen.</p>
                        </div>
                        <div className="how-it-works-step card">
                            <div className="step-number numeric">3</div>
                            <h3>Inzicht</h3>
                            <p className="small text-300">Begin met tracken en ontvang gepersonaliseerde inzichten.</p>
                        </div>
                        <div className="how-it-works-step card">
                            <div className="step-number numeric">4</div>
                            <h3>Optimaliseer</h3>
                            <p className="small text-300">Gebruik de aanbevelingen om je gezondheid te verbeteren.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="testimonials-section section">
                <div className="container">
                    <h2>Wat gebruikers zeggen</h2>
                    <div className="testimonials-grid d-flex gap-6 justify-center flex-wrap mt-6">
                        <blockquote className="testimonial card">
                            <img src={sophieImage} alt="Sophie" className="testimonial-avatar" />
                            <p>&quot;Sinds ik DICO gebruik zijn mijn waardes stabieler dan ooit.&quot;</p>
                            <footer>- Sophie, 42</footer>
                        </blockquote>
                        <blockquote className="testimonial card">
                            <img src={marcoImage} alt="Marco" className="testimonial-avatar" />
                            <p>&quot;De app motiveert me dagelijks om gezondere keuzes te maken.&quot;</p>
                            <footer>- Marco, 35</footer>
                        </blockquote>
                        <blockquote className="testimonial card">
                            <img src={fatimaImage} alt="Fatima" className="testimonial-avatar" />
                            <p>&quot;De integratie met mijn zorgverlener heeft mijn behandeling echt verbeterd.&quot;</p>
                            <footer>- Fatima, 58</footer>
                        </blockquote>
                    </div>
                </div>
            </section>

            <section className="cta-section section">
                <div className="container">
                    <h2>Klaar om de controle terug te nemen?</h2>
                    <p className="auth-form-description">Sluit je aan bij duizenden gebruikers die hun diabetesmanagement transformeren met DICO's slimme inzichten en gepersonaliseerde ondersteuning.</p>
                    <div className="d-flex gap-4 justify-center mt-6">
                        <Link to="/register" className="btn btn--primary">
                            Begin Vandaag Gratis
                        </Link>
                        <a href="#features" className="btn btn--ghost">
                            Ontdek Meer
                        </a>
                    </div>
                </div>
            </section>

            <footer className="main-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} DICO – Alle rechten voorbehouden</p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
