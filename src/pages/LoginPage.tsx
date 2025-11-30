import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch('http://localhost:8001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.access_token);
                // Redirect to a protected route or home page
                navigate('/');
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Login failed');
            }
        } catch (err) {
            setError('Network error or server is unreachable');
            console.error('Login error:', err);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <div style={{ padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: '#fff', width: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Login</h2>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="username" style={{ display: 'block', marginBottom: '8px', color: '#555' }}>Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', color: '#555' }}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                        />
                    </div>
                    {error && <p style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>{error}</p>}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;