import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldCheck, User } from 'lucide-react';

const Login = () => {
    const [role, setRole] = useState('user');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(identifier, password, role);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        }
    };

    return (
        <div className="container fade-in" style={{ maxWidth: '450px', marginTop: '4rem' }}>
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '50%', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <LogIn size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Please enter your details to sign in</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button 
                        onClick={() => setRole('user')}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: `2px solid ${role === 'user' ? 'var(--primary)' : 'var(--border)'}`, background: role === 'user' ? 'rgba(37, 99, 235, 0.05)' : 'white', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <User size={18} /> User
                    </button>
                    <button 
                        onClick={() => setRole('police')}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: `2px solid ${role === 'police' ? 'var(--primary)' : 'var(--border)'}`, background: role === 'police' ? 'rgba(37, 99, 235, 0.05)' : 'white', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <ShieldCheck size={18} /> Police
                    </button>
                </div>

                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>{role === 'police' ? 'Email Address' : 'Phone Number'}</label>
                        <input 
                            type={role === 'police' ? 'email' : 'text'} 
                            value={identifier} 
                            onChange={(e) => setIdentifier(e.target.value)} 
                            required 
                            placeholder={role === 'police' ? 'officer@police.gov' : 'Enter your phone number'}
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Sign In
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
