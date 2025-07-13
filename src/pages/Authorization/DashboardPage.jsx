import React from 'react';
import { useUser } from '../../contexts/UserContext.jsx';
import '../../App.css';
function DashboardPage() {
    const { logout } = useUser();
    return (
        <div className="dashboard-container">
            <header className="dashboard-header container flex justify-between">
                <h1>Dashboard</h1>
                <button onClick={logout} className="btn btn-outline">Uitloggen</button>
            </header>
            <section className="dashboard-main container flex">
                <div className="glucose-summary flex-center">
                    <h2>6.3 <span>mmol/L</span></h2>
                </div>
                <div className="dashboard-widgets grid" style={{gridTemplateColumns: 'repeat(3, 1fr)'}}>
                    {[...Array(9)].map((_, i) => (<div key={i} className="widget-card" />))}
                </div>
            </section>
        </div>
    );
}
export default DashboardPage;