import React, { useState, useEffect } from 'react';

interface User {
    user_id: number;
    username: string;
    email: string;
    is_admin: boolean;
}

const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newUser, setNewUser] = useState({ username: '', password: '', email: '' });

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Authentication token not found. Please log in.');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:8001/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data: User[] = await response.json();
                setUsers(data);
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Failed to fetch users');
            }
        } catch (err) {
            setError('Network error or server is unreachable');
            console.error('Fetch users error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Authentication token not found. Please log in.');
                return;
            }

            const response = await fetch('http://localhost:8001/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                setNewUser({ username: '', password: '', email: '' });
                fetchUsers(); // Refresh the user list
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Failed to create user');
            }
        } catch (err) {
            setError('Network error or server is unreachable');
            console.error('Create user error:', err);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        setError(null);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setError('Authentication token not found. Please log in.');
                return;
            }

            const response = await fetch(`http://localhost:8001/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchUsers(); // Refresh the user list
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Failed to delete user');
            }
        } catch (err) {
            setError('Network error or server is unreachable');
            console.error('Delete user error:', err);
        }
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading users...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Admin Panel - User Management</h1>

            {error && <p style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>{error}</p>}

            <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <h3 style={{ marginBottom: '20px', color: '#555' }}>Create New User</h3>
                <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        required
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '10px 15px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
                    >
                        Add User
                    </button>
                </form>
            </div>

            <h3 style={{ marginBottom: '20px', color: '#555' }}>Existing Users</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: '8px', overflow: 'hidden' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Username</th>
                        <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
                        <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Admin</th>
                        <th style={{ padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px 15px' }}>{user.user_id}</td>
                            <td style={{ padding: '12px 15px' }}>{user.username}</td>
                            <td style={{ padding: '12px 15px' }}>{user.email}</td>
                            <td style={{ padding: '12px 15px' }}>{user.is_admin ? 'Yes' : 'No'}</td>
                            <td style={{ padding: '12px 15px' }}>
                                <button
                                    onClick={() => handleDeleteUser(user.user_id)}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s ease'
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c82333')}
                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#dc3545')}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;