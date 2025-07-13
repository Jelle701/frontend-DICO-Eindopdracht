import React from 'react';
import { Link } from 'react-router-dom';
import '../open/HomePage.css';
import '../../App.css';
import logo from '../../content/DicoLogowitV1.svg';

const HomePage = () => {
    return (
        <div className="homepage">
            {/* TOP BANNER */}
            <div className="top-banner">
                <p>
                    De nieuwe DICO ervaring is hier.{' '}
                    <a href="#" className="top-banner-link">Bekijk de video</a>
                </p>
            </div>

            {/* NAVIGATION */}
            <header className="hero-section">
                <nav className="hero-nav">
                    <div className="container navbar">
                        <div className="navbar-left">
                            <Link to="/" className="logo">
                                <img src={logo} alt="DICO Logo" height="35" />
                            </Link>
                        </div>
                        <ul className="navbar-center">
                            <li><a href="#membership">Lidmaatschap</a></li>
                            <li><a href="#how">Hoe werkt het</a></li>
                            <li><a href="#why">Waarom DICO</a></li>
                            <li><a href="#accessories">Accessoires</a></li>
                        </ul>
                        <div className="navbar-right">
                            <Link to="/register" className="btn btn-light">JOIN NU</Link>
                        </div>
                    </div>
                </nav>

                <div className="hero-content container">
                    <h1>Optimaliseer je gezondheid.</h1>
                    <p>Beheer je glucose, medicatie en lifestyle met de DICO app.</p>
                    <button className="btn btn-primary">Probeer DICO</button>
                    <video
                        src="/videos/intro.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="hero-video"
                    >
                        Je browser ondersteunt geen video tag.
                    </video>
                </div>
            </header>

            {/* FEATURES */}
            <section id="features" className="features-section container">
                <div className="features-grid">
                    <div className="feature-text">
                        <h2>Volledige controle over je glucosewaarden</h2>
                        <p>Registreer metingen, bekijk trends, en deel inzichten met je zorgverleners in realtime.</p>
                    </div>
                    <div className="feature-img">
                        <img src="/images/glucose-tracker.png" alt="Glucose visualisatie" />
                    </div>
                </div>

                <div className="features-grid reverse">
                    <div className="feature-img">
                        <img src="/images/lifestyle-tracking.png" alt="Lifestyle visualisatie" />
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
                    <Link to="/register" className="btn btn-secondary">Maak een account aan</Link>
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
