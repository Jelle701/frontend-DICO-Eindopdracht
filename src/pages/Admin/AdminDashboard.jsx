import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom'; // Importeer useLocation
import { getAllUsers, deleteUserById, updateUserById } from '../../services/AdminService.jsx'; 
import Navbar from '../../components/Navbar';
import EditUserModal from './EditUserModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import Notification from '../../components/Notification';
import AnalyticsCharts from './AnalyticsCharts';
import ActivityFeed from './ActivityFeed';
import TableSkeleton from './TableSkeleton';
import './AdminDashboard.css';

// --- Sub-components ---
const StatCard = ({ title, value }) => (
    <div className="stat-card"><h3>{title}</h3><p>{value}</p></div>
);

const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) pageNumbers.push(i);
    if (pageNumbers.length <= 1) return null;
    return (
        <nav className="pagination-container">
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a onClick={() => paginate(number)} href="#!" className="page-link">{number}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

// --- Main Component ---
const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [bulkRole, setBulkRole] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const location = useLocation(); // Gebruik de location hook

    // Effect om de actieve tab te synchroniseren met de URL-hash
    useEffect(() => {
        const hash = location.hash;
        if (hash === '#management') {
            setActiveTab('management');
        } else {
            setActiveTab('dashboard');
        }
    }, [location.hash]);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        const { data, error: apiError } = await getAllUsers();
        if (apiError) setError(apiError.message || 'Fout bij het ophalen van gebruikers.');
        else setUsers(data);
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    const processedUsers = useMemo(() => {
        let filtered = users.filter(user => {
            if (roleFilter !== 'ALL' && user.role !== roleFilter) return false;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
                return user.email.toLowerCase().includes(term) || fullName.includes(term);
            }
            return true;
        });
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        setCurrentPage(1);
        return filtered;
    }, [users, searchTerm, roleFilter, sortConfig]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = processedUsers.slice(indexOfFirstUser, indexOfLastUser);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    const getSortClass = (key) => sortConfig.key === key ? sortConfig.direction : '';

    const stats = useMemo(() => ({ total: users.length, patients: users.filter(u => u.role === 'PATIENT').length, guardians: users.filter(u => u.role === 'GUARDIAN').length, providers: users.filter(u => u.role === 'PROVIDER').length }), [users]);

    const handleSaveUser = (updatedUser) => {
        setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
        setNotification({ message: 'Gebruiker succesvol bijgewerkt!', type: 'success' });
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === currentUsers.length) setSelectedUsers([]);
        else setSelectedUsers(currentUsers.map(user => user.id));
    };

    const handleDeleteSelected = async () => {
        if (window.confirm(`Weet je zeker dat je ${selectedUsers.length} gebruikers permanent wilt verwijderen?`)) {
            const promises = selectedUsers.map(id => deleteUserById(id));
            await Promise.all(promises);
            fetchUsers();
            setSelectedUsers([]);
            setNotification({ message: `${selectedUsers.length} gebruikers verwijderd.`, type: 'success' });
        }
    };

    const handleBulkRoleChange = async () => {
        if (!bulkRole) return;
        if (window.confirm(`Weet je zeker dat je de rol van ${selectedUsers.length} gebruikers wilt wijzigen naar ${bulkRole}?`)) {
            const promises = selectedUsers.map(id => updateUserById(id, { role: bulkRole }));
            await Promise.all(promises);
            fetchUsers();
            setSelectedUsers([]);
            setBulkRole('');
            setNotification({ message: `Rol succesvol gewijzigd voor ${selectedUsers.length} gebruikers.`, type: 'success' });
        }
    };

    const handleExportCSV = () => {
        const headers = ["ID", "Email", "FirstName", "LastName", "Role", "CreatedAt"];
        const csvRows = [headers.join(','), ...processedUsers.map(user => [user.id, `"${user.email}"`, `"${user.firstName || ''}"`, `"${user.lastName || ''}"`, `"${user.role}"`, `"${new Date(user.createdAt).toISOString()}"`].join(','))];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gebruikers.csv';
        a.click();
        URL.revokeObjectURL(url);
        setNotification({ message: 'Gebruikerslijst is geëxporteerd.', type: 'success' });
    };

    return (
        <>
            <Navbar />
            <div className="admin-dashboard-container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Krijg inzicht in de gebruikersdata en beheer het platform.</p>
                </div>

                <div className="tabs-container">
                    <a href="#dashboard" className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</a>
                    <a href="#management" className={`tab-button ${activeTab === 'management' ? 'active' : ''}`} onClick={() => setActiveTab('management')}>Gebruikersbeheer</a>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="tab-content">
                        <div className="dashboard-grid">
                            <AnalyticsCharts users={users} />
                            <ActivityFeed />
                        </div>
                        <div className="stats-container">
                            <StatCard title="Totaal Gebruikers" value={stats.total} /><StatCard title="Patiënten" value={stats.patients} /><StatCard title="Ouders / Voogden" value={stats.guardians} /><StatCard title="Zorgverleners" value={stats.providers} />
                        </div>
                    </div>
                )}

                {activeTab === 'management' && (
                    <div className="tab-content">
                        <div className="filters-container">
                            <input type="text" placeholder="Zoek op naam of e-mail..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="search-input"/>
                            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="role-filter">
                                <option value="ALL">Alle Rollen</option><option value="PATIENT">Patiënt</option><option value="GUARDIAN">Ouder / Voogd</option><option value="PROVIDER">Zorgverlener</option><option value="ADMIN">Admin</option>
                            </select>
                            <button onClick={handleExportCSV} className="btn-secondary">Exporteer CSV</button>
                        </div>

                        {selectedUsers.length > 0 && (
                            <div className="bulk-actions-container">
                                <span>{selectedUsers.length} geselecteerd</span>
                                <div className="bulk-actions-buttons">
                                    <select value={bulkRole} onChange={(e) => setBulkRole(e.target.value)} className="bulk-role-select"><option value="">Kies nieuwe rol...</option><option value="PATIENT">Patiënt</option><option value="GUARDIAN">Ouder / Voogd</option><option value="PROVIDER">Zorgverlener</option></select>
                                    <button onClick={handleBulkRoleChange} disabled={!bulkRole} className="btn-secondary">Pas Rol Aan</button>
                                    <button onClick={handleDeleteSelected} className="btn-danger">Verwijder Geselecteerden</button>
                                </div>
                            </div>
                        )}

                        {loading && <TableSkeleton />}
                        {error && <p className="error-message">{error}</p>}
                        {!loading && !error && (
                            currentUsers.length > 0 ? (
                                <>
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th><input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0} /></th>
                                                <th onClick={() => requestSort('id')} className={`sortable ${getSortClass('id')}`}>ID</th>
                                                <th onClick={() => requestSort('email')} className={`sortable ${getSortClass('email')}`}>Email</th>
                                                <th onClick={() => requestSort('lastName')} className={`sortable ${getSortClass('lastName')}`}>Naam</th>
                                                <th onClick={() => requestSort('role')} className={`sortable ${getSortClass('role')}`}>Rol</th>
                                                <th onClick={() => requestSort('createdAt')} className={`sortable ${getSortClass('createdAt')}`}>Geregistreerd op</th>
                                                <th>Acties</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentUsers.map(user => (
                                                <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected' : ''}>
                                                    <td><input type="checkbox" onChange={() => handleSelectUser(user.id)} checked={selectedUsers.includes(user.id)} /></td>
                                                    <td>{user.id}</td><td>{user.email}</td><td>{`${user.firstName || ''} ${user.lastName || ''}`}</td><td>{user.role}</td><td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                    <td className="actions"><button onClick={() => { setCurrentUser(user); setIsEditModalOpen(true); }} className="edit-btn">Aanpassen</button><button onClick={() => { setUserToDelete(user); setIsConfirmModalOpen(true); }} className="delete-btn">Verwijderen</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <Pagination usersPerPage={usersPerPage} totalUsers={processedUsers.length} paginate={paginate} currentPage={currentPage}/>
                                </>
                            ) : <div className="empty-state"><p>Geen gebruikers gevonden die aan uw criteria voldoen.</p></div>
                        )}
                    </div>
                )}
            </div>

            {isEditModalOpen && <EditUserModal user={currentUser} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveUser}/>}
            {isConfirmModalOpen && <ConfirmationModal title="Bevestig Verwijdering" message={`Weet je zeker dat je ${userToDelete?.email} wilt verwijderen?`} onConfirm={() => { if(userToDelete) { const p = deleteUserById(userToDelete.id); p.then(res => { if(res.error) setNotification({message: res.error.message, type: 'error'}); else { setUsers(u => u.filter(i => i.id !== userToDelete.id)); setNotification({message: `Gebruiker ${userToDelete.email} verwijderd.`, type: 'success'}); } }); setIsConfirmModalOpen(false); setUserToDelete(null); } }} onCancel={() => setIsConfirmModalOpen(false)}/>}
            {notification.message && <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })}/>}
        </>
    );
};

export default AdminDashboard;
