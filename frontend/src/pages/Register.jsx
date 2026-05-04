import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, ShieldCheck, User as UserIcon, MapPin, Phone, Mail, Lock } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('user');
    const [formData, setFormData] = useState({
        name: '', address: '', phone: '', email: '', password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = role === 'police' ? '/api/auth/register/police' : '/api/auth/register/user';
            const payload = role === 'police' 
                ? { name: formData.name, email: formData.email, password: formData.password }
                : { name: formData.name, address: formData.address, phone: formData.phone, password: formData.password };
            
            await axios.post(`http://localhost:5000${endpoint}`, payload);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container fade-in" style={{ maxWidth: '500px', marginTop: '2rem', marginBottom: '4rem' }}>
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '50%', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <UserPlus size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Join SafeGuard and contribute to public safety</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button 
                        onClick={() => setRole('user')}
                        style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: `2px solid ${role === 'user' ? 'var(--primary)' : 'var(--border)'}`, background: role === 'user' ? 'rgba(37, 99, 235, 0.05)' : 'white', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <UserIcon size={18} /> User
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
                        <label>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <UserIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                            <input type="text" name="name" style={{ paddingLeft: '2.5rem' }} value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                        </div>
                    </div>

                    {role === 'user' && (
                        <>
                            <div className="input-group">
                                <label>Address</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                    <input type="text" name="address" style={{ paddingLeft: '2.5rem' }} value={formData.address} onChange={handleChange} required placeholder="Street name, City" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                    <input type="tel" name="phone" style={{ paddingLeft: '2.5rem' }} value={formData.phone} onChange={handleChange} required placeholder="+91 1234567890" />
                                </div>
                            </div>
                        </>
                    )}

                    {role === 'police' && (
                        <div className="input-group">
                            <label>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                <input type="email" name="email" style={{ paddingLeft: '2.5rem' }} value={formData.email} onChange={handleChange} required placeholder="officer@police.gov" />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                            <input type="password" name="password" style={{ paddingLeft: '2.5rem' }} value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
