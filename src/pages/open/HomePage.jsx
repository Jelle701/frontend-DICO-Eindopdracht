import React, { useContext } from 'react';
import './HomePage.css';
import 'src/index.css';
import Navbar from "../../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { ThemeContext } from 'src/contexts/ThemeContext.jsx'; // ✅ correct pad


const HomePage = () => {
    const { theme } = useContext(ThemeContext); // haal huidige thema op

    return (
        <div className={`homepage theme-${theme}`}>
            {/* TOP BANNER */}
            <div className="top-banner">
                <p>
                    De nieuwe DICO ervaring is hier.{' '}
                    <a href="#" className="top-banner-link">Bekijk de video</a>
                </p>
            </div>

            <Navbar />

            <header className="hero-section">
                <div className="hero-content container">
                    <video
                        src="src/content/Test-Video.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="hero-video"
                    />

                    <div className="hero-context">
                        <h1>Optimaliseer je gezondheid.</h1>
                        <p>Beheer je glucose, medicatie en lifestyle met de DICO app.</p>
                        <Link to="/register" className="btn btn-primary">
                            Probeer DICO
                        </Link>
                    </div>
                </div>
            </header>

            {/* FEATURES */}
            <section id="features" className="features-section container">
                <div className="features-grid">
                    <div className="feature-text">
                        <h2>Volledige controle over je glucosewaarden</h2>
                        <p>Registreer metingen, bekijk trends, en deel inzichten met je zorgverleners in realtime.</p>
                    </div>
                    <div>
                        <img className="feature-img1" src="src/content/Man%20met%20sensor.png" alt="Glucose visualisatie" />
                    </div>
                </div>

                <div className="features-grid reverse">
                    <div>
                        <img className="feature-img2" src="src/content/Grafiek.png" alt="Lifestyle visualisatie" />
                    </div>
                    <div className="feature-text">
                        <h2>Alles-in-één app</h2>
                        <p>Monitor voeding, beweging, slaap en medicatie – allemaal op één plek.</p>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="testimonials-section">
                <h2>Wat gebruikers zeggen</h2>
                <div className="testimonials-grid container">
                    <blockquote className="testimonial">
                        <p>"Sinds ik DICO gebruik zijn mijn waardes stabieler dan ooit."</p>
                        <footer>- Sophie, 42</footer>
                    </blockquote>
                    <blockquote className="testimonial">
                        <p>"De app motiveert me dagelijks om gezondere keuzes te maken."</p>
                        <footer>- Marco, 35</footer>
                    </blockquote>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container text-center">
                    <h2>Start vandaag nog met DICO</h2>
                    <p>Ervaar de voordelen van inzicht in je gezondheid.</p>
                    <Link to="/register" className="btn btn-secondary">
                        Maak een account aan
                    </Link>

                </div>
            </section>

            {/* FOOTER */}
            <footer className="main-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} DICO – Alle rechten voorbehouden</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
