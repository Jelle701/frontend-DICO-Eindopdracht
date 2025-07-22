import React from 'react';
import Navbar from '../../components/Navbar';
import '../../App.css'; // Zorg dat de algemene stijlen hier ook gelden

// Een eenvoudige placeholder voor de Glucose Pagina
function GlucosePage() {
    // De :id parameter kan uit de URL gehaald worden met useParams, indien nodig.
    // import { useParams } from 'react-router-dom';
    // const { id } = useParams();

    return (
        <div>
            <Navbar />
            <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
                <h1>Glucose Details</h1>
                <p>Hier komen de details voor de geselecteerde glucosemeting.</p>
                {/* Hier kun je een grafiek of tabel met glucosedata tonen */}
                <div style={{
                    border: '1px solid var(--color-muted)',
                    padding: '2rem',
                    marginTop: '2rem',
                    borderRadius: '0.5rem'
                }}>
                    <p>Grafiek of data visualisatie komt hier.</p>
                </div>
            </div>
        </div>
    );
}

export default GlucosePage;