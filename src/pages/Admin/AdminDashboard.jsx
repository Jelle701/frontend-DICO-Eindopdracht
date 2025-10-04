import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllUsers, deleteUserById, updateUserById } from '../../services/AdminService.jsx';
import Navbar from '../../components/Navbar';
import EditUserModal from './EditUserModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import Notification from '../../components/Notification';
import AnalyticsCharts from './AnalyticsCharts';
import ActivityFeed from './ActivityFeed';
import TableSkeleton from './TableSkeleton';
import './AdminDashboard.css';

// --- Child Component: Dashboard Tab ---
const DashboardTab = ({ users }) => {
    const stats = useMemo(() => ({
        total: users.length,
        patients: users.filter(u => u.role === 'PATIENT').length,
        guardians: users.filter(u => u.role === 'GUARDIAN').length,
        providers: users.filter(u => u.role === 'PROVIDER').length
    }), [users]);

    return (
        <div className="tab-content">
            <div className="stats-container">
                <div className="card stat-card"><h3>Totaal Gebruikers</h3><p className="numeric">{stats.total}</p></div>
                <div className="card stat-card"><h3>Patiënten</h3><p className="numeric">{stats.patients}</p></div>
                <div className="card stat-card"><h3>Ouders/Voogden</h3><p className="numeric">{stats.guardians}</p></div>
                <div className="card stat-card"><h3>Zorgverleners</h3><p className="numeric">{stats.providers}</p></div>
            </div>
            <div className="dashboard-grid">
                <AnalyticsCharts users={users} />
                <ActivityFeed />
            </div>
        </div>
    );
};

// --- Child Component: User Management Tab ---
const UserManagementTab = ({ users, loading, error, fetchUsers, setNotification }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [bulkRole, setBulkRole] = useState('');

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
        return filtered;
    }, [users, searchTerm, roleFilter, sortConfig]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, roleFilter]);

    const currentUsers = useMemo(() => processedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage), [processedUsers, currentPage, usersPerPage]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === currentUsers.length) setSelectedUsers([]);
        else setSelectedUsers(currentUsers.map(user => user.id));
    };

    const handleDeleteSelected = async () => {
        if (window.confirm(`Weet je zeker dat je ${selectedUsers.length} gebruikers permanent wilt verwijderen?`)) {
            await Promise.all(selectedUsers.map(id => deleteUserById(id)));
            fetchUsers();
            setSelectedUsers([]);
            setNotification({ message: `${selectedUsers.length} gebruikers verwijderd.`, type: 'success' });
        }
    };

    const handleBulkRoleChange = async () => {
        if (!bulkRole) return;
        if (window.confirm(`Weet je zeker dat je de rol van ${selectedUsers.length} gebruikers wilt wijzigen naar ${bulkRole}?`)) {
            await Promise.all(selectedUsers.map(id => updateUserById(id, { role: bulkRole })));
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
        <div className="tab-content">
            <div className="admin-toolbar card">
                <input type="text" placeholder="Zoek op naam of e-mail..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input"/>
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input">
                    <option value="ALL">Alle Rollen</option><option value="PATIENT">Patiënt</option><option value="GUARDIAN">Ouder / Voogd</option><option value="PROVIDER">Zorgverlener</option><option value="ADMIN">Admin</option>
                </select>
                <button onClick={handleExportCSV} className="btn">Exporteer CSV</button>
            </div>

            {selectedUsers.length > 0 && (
                <div className="bulk-actions-container card">
                    <span>{selectedUsers.length} geselecteerd</span>
                    <div className="bulk-actions-buttons">
                        <select value={bulkRole} onChange={(e) => setBulkRole(e.target.value)} className="input"><option value="">Kies nieuwe rol...</option><option value="PATIENT">Patiënt</option><option value="GUARDIAN">Ouder / Voogd</option><option value="PROVIDER">Zorgverlener</option></select>
                        <button onClick={handleBulkRoleChange} disabled={!bulkRole} className="btn">Pas Rol Aan</button>
                        <button onClick={handleDeleteSelected} className="btn btn--ghost">Verwijder</button>
                    </div>
                </div>
            )}

            <div className="table-container">
                {loading ? <TableSkeleton /> : error ? <p className="error-message">{error}</p> : (
                    currentUsers.length > 0 ? (
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0} /></th>
                                        <th onClick={() => requestSort('id')} className={`sortable ${sortConfig.key === 'id' ? sortConfig.direction : ''}`}>ID</th>
                                        <th onClick={() => requestSort('email')} className={`sortable ${sortConfig.key === 'email' ? sortConfig.direction : ''}`}>Email</th>
                                        <th onClick={() => requestSort('lastName')} className={`sortable ${sortConfig.key === 'lastName' ? sortConfig.direction : ''}`}>Naam</th>
                                        <th onClick={() => requestSort('role')} className={`sortable ${sortConfig.key === 'role' ? sortConfig.direction : ''}`}>Rol</th>
                                        <th onClick={() => requestSort('createdAt')} className={`sortable ${sortConfig.key === 'createdAt' ? sortConfig.direction : ''}`}>Geregistreerd</th>
                                        <th>Acties</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map(user => (
                                        <UserTableRow key={user.id} user={user} selectedUsers={selectedUsers} onSelectUser={setSelectedUsers} fetchUsers={fetchUsers} setNotification={setNotification} />
                                    ))}
                                </tbody>
                            </table>
                            <Pagination usersPerPage={usersPerPage} totalUsers={processedUsers.length} paginate={(p) => setCurrentPage(p)} currentPage={currentPage}/>
                        </>
                    ) : <div className="empty-state card"><p>Geen gebruikers gevonden die aan uw criteria voldoen.</p></div>
                )}
            </div>
        </div>
    );
};

const UserTableRow = ({ user, selectedUsers, onSelectUser, fetchUsers, setNotification }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleSaveUser = (updatedUser) => {
        // This is optimistic UI update, but fetchUsers will be the source of truth
        fetchUsers();
        setNotification({ message: 'Gebruiker succesvol bijgewerkt!', type: 'success' });
    };

    const handleDelete = async () => {
        const { error } = await deleteUserById(user.id);
        if (error) {
            setNotification({ message: error.message, type: 'error' });
        } else {
            fetchUsers();
            setNotification({ message: `Gebruiker ${user.email} verwijderd.`, type: 'success' });
        }
        setIsConfirmModalOpen(false);
    };

    return (
        <>
            <tr className={selectedUsers.includes(user.id) ? 'selected' : ''}>
                <td><input type="checkbox" onChange={() => onSelectUser(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id])} checked={selectedUsers.includes(user.id)} /></td>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{`${user.firstName || ''} ${user.lastName || ''}`}</td>
                <td><span className={`badge badge--role-${(user.role || 'default').toLowerCase()}`}>{user.role || 'N/A'}</span></td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                    <button onClick={() => setIsEditModalOpen(true)} className="btn btn--ghost">Aanpassen</button>
                    <button onClick={() => setIsConfirmModalOpen(true)} className="btn btn--ghost">Verwijderen</button>
                </td>
            </tr>
            {isEditModalOpen && <EditUserModal user={user} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveUser} />}
            {isConfirmModalOpen && <ConfirmationModal title="Bevestig Verwijdering" message={`Weet je zeker dat je ${user.email} wilt verwijderen?`} onConfirm={handleDelete} onCancel={() => setIsConfirmModalOpen(false)} />}
        </>
    );
};

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

// --- Main AdminDashboard Component ---
const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [activeTab, setActiveTab] = useState('dashboard');
    const location = useLocation();

    useEffect(() => {
        const hash = location.hash.substring(1);
        if (hash === 'management') setActiveTab('management');
        else setActiveTab('dashboard');
    }, [location.hash]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const { data, error: apiError } = await getAllUsers();
        if (apiError) setError(apiError.message || 'Fout bij het ophalen van gebruikers.');
        else setUsers(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    return (
        <>
            <Navbar />
            <div className="admin-dashboard-container page--dark">
                <header className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Krijg inzicht in de gebruikersdata en beheer het platform.</p>
                </header>

                <div className="tabs-container">
                    <a href="#dashboard" className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</a>
                    <a href="#management" className={`tab-button ${activeTab === 'management' ? 'active' : ''}`} onClick={() => setActiveTab('management')}>Gebruikersbeheer</a>
                </div>

                {activeTab === 'dashboard' && <DashboardTab users={users} />}
                {activeTab === 'management' && <UserManagementTab users={users} loading={loading} error={error} fetchUsers={fetchUsers} setNotification={setNotification} />}
            </div>
            {notification.message && <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })}/>}
        </>
    );
};

export default AdminDashboard;
