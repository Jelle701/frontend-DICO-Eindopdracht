/**
 * @file HomePage.jsx
 * @description This is the main landing page of the DICO application. It provides an overview of the app's features,
 * benefits, and user testimonials to attract new users. The page includes a hero section with a call-to-action
 * to register, sections detailing key features, user testimonials, and a final call-to-action to create an account.
 *
 * @component
 * @returns {JSX.Element} The rendered homepage component.
 *
 * @functions
 * - `HomePage()`: The main functional component that renders the entire landing page. It is a static page and does not contain any complex logic or state management.
 */
import React from 'react';
import { Link } from "react-router-dom";
import Navbar from '../../components/Navbar.jsx';
import './HomePage.css';

// Importeer je afbeeldingen en video's hier
import heroVideo from '../../content/HomepageVideo.mp4';
// import manWithSensor from 'src/content/Man met sensor.png';
// import graphImage from 'src/content/Grafiek.png';

function HomePage() {
    return (
        <div className="homepage">
            <div className="top-banner">
                <p>
                    De nieuwe DICO ervaring is hier!{' '}
                    <a href="#" className="top-banner-link">Bekijk de video</a>
                </p>
            </div>

            <header className="hero-section">
                <video src={heroVideo} autoPlay muted loop className="hero-video" />
                <div className="hero-content">
                    <h1>Optimaliseer je gezondheid.</h1>
                    <p>Beheer je glucose, medicatie en lifestyle met de DICO app.</p>
                    <Link to="/register" className="btn btn-primary">
                        Probeer DICO
                    </Link>
                </div>
            </header>

            <section id="features" className="features-section container">
                <div className="features-grid">
                    <div className="feature-text">
                        <h2>Volledige controle over je glucosewaarden</h2>
                        <p>Registreer metingen, bekijk trends, en deel inzichten met je zorgverleners in realtime.</p>
                    </div>
                    {/* <img className="feature-img1" src={manWithSensor} alt="Man met een glucose sensor" /> */}
                </div>
                <div className="features-grid reverse">
                    <div className="feature-text">
                        <h2>Alles-in-één app</h2>
                        <p>Monitor voeding, beweging, slaap en medicatie – allemaal op één plek.</p>
                    </div>
                    {/* <img className="feature-img2" src={graphImage} alt="Grafiek van glucosewaarden" /> */}
                </div>
            </section>

            <section className="testimonials-section">
                <h2>Wat gebruikers zeggen</h2>
                <div className="testimonials-grid container">
                    <blockquote className="testimonial">
                        <p>&quot;Sinds ik DICO gebruik zijn mijn waardes stabieler dan ooit.&quot;</p>
                        <footer>- Sophie, 42</footer>
                    </blockquote>
                    <blockquote className="testimonial">
                        <p>&quot;De app motiveert me dagelijks om gezondere keuzes te maken.&quot;</p>
                        <footer>- Marco, 35</footer>
                    </blockquote>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <h2>Start vandaag nog met DICO</h2>
                    <p>Ervaar de voordelen van inzicht in je gezondheid.</p>
                    <Link to="/register" className="btn btn-secondary">
                        Maak een account aan
                    </Link>
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