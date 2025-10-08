import React from 'react';
import Navbar from '../../components/web components/Navbar.jsx';
import '../../App.css'; // Zorg dat de algemene stijlen hier ook gelden

// Een eenvoudige placeholder voor de Glucose Pagina
function GlucosePage() {
    // De :id parameter kan uit de URL gehaald worden met useParams, indien nodig.
    // import { useParams } from 'react-router-dom';
    // const { id } = useParams();

    return (
        <>
            <Navbar />
            <div className="container pt-6 text-center">
                <h1>Glucose Details</h1>
                <p>Hier komen de details voor de geselecteerde glucosemeting.</p>
                {/* Hier kun je een grafiek of tabel met glucosedata tonen */}
                <div className="placeholder-box">
                    <p>Grafiek of data visualisatie komt hier.</p>
                </div>
            </div>
        </>
    );
}

export default GlucosePage;