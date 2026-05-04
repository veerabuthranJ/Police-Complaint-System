import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, AlertCircle, CheckCircle2, ChevronRight, UserPlus, MapPin, Bell } from 'lucide-react';
import { io } from 'socket.io-client';

const PoliceDashboard = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [officers, setOfficers] = useState([]);
    const [view, setView] = useState('complaints'); // complaints or alerts

    useEffect(() => {
        fetchData();

        const socket = io('http://localhost:5000');
        socket.on('newEmergency', (data) => {
            setAlerts(prev => [data, ...prev]);
            if (Notification.permission === 'granted') {
                new Notification('EMERGENCY ALERT', {
                    body: `Emergency reported by ${data.userId?.name}. Location: ${data.location.latitude}, ${data.location.longitude}`
                });
            } else {
                alert(`!!! EMERGENCY ALERT !!!\nUser: ${data.userId?.name}\nPhone: ${data.userId?.phone}\nAssigned to: ${data.assignedOfficer?.name || 'Self'}`);
            }
        });

        // Request notification permission
        if (Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        return () => socket.disconnect();
    }, []);

    const fetchData = async () => {
        try {
            const [complaintsRes, alertsRes, officersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/complaints/all'),
                axios.get('http://localhost:5000/api/emergency/all'),
                axios.get('http://localhost:5000/api/police/all')
            ]);
            setComplaints(complaintsRes.data);
            setAlerts(alertsRes.data);
            setOfficers(officersRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const handleAssign = async (complaintId, officerId) => {
        try {
            await axios.put(`http://localhost:5000/api/complaints/assign/${complaintId}`, { officerId });
            fetchData();
        } catch (err) {
            alert('Assignment failed');
        }
    };

    const handleStatusUpdate = async (complaintId, status) => {
        try {
            await axios.put(`http://localhost:5000/api/complaints/status/${complaintId}`, { status });
            fetchData();
        } catch (err) {
            alert('Status update failed');
        }
    };

    const handleEmergencyAssign = async (alertId, officerId) => {
        try {
            await axios.put(`http://localhost:5000/api/emergency/assign/${alertId}`, { officerId });
            fetchData();
        } catch (err) {
            alert('Emergency assignment failed');
        }
    };

    return (
        <div className="container fade-in">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Police Administration</h1>
                    <p style={{ color: 'var(--secondary)' }}>Managing public safety and case resolutions</p>
                </div>
                <button onClick={fetchData} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
                    Refresh Data
                </button>
            </header>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button 
                    onClick={() => setView('complaints')} 
                    className="btn" 
                    style={{ background: view === 'complaints' ? 'var(--primary)' : 'white', color: view === 'complaints' ? 'white' : 'var(--foreground)', border: '1px solid var(--border)' }}
                >
                    <Shield size={18} /> All Complaints ({complaints.length})
                </button>
                <button 
                    onClick={() => setView('alerts')} 
                    className="btn" 
                    style={{ background: view === 'alerts' ? 'var(--primary)' : 'white', color: view === 'alerts' ? 'white' : 'var(--foreground)', border: '1px solid var(--border)' }}
                >
                    <AlertCircle size={18} /> Emergency Alerts ({alerts.length})
                </button>
            </div>

            <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>{view === 'complaints' ? 'Recent Complaints' : 'Emergency Notifications'}</h2>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'var(--background)', fontSize: '0.875rem', color: 'var(--secondary)' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem' }}>Details</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Reporter</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Evidence</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Location</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Assignment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {view === 'complaints' ? (
                                complaints.map(c => (
                                    <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ fontWeight: 600 }}>ID: {c._id.substring(18)}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{new Date(c.createdAt).toLocaleString()}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div>{c.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{c.phone}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {c.proofImage && (
                                                    <a href={`http://localhost:5000/${c.proofImage}`} target="_blank" rel="noreferrer">
                                                        <img src={`http://localhost:5000/${c.proofImage}`} alt="Proof" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} />
                                                    </a>
                                                )}
                                                {c.incidentImage && (
                                                    <a href={`http://localhost:5000/${c.incidentImage}`} target="_blank" rel="noreferrer">
                                                        <img src={`http://localhost:5000/${c.incidentImage}`} alt="Incident" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div>{c.area}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Pin: {c.pincode}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <select 
                                                value={c.status} 
                                                onChange={(e) => handleStatusUpdate(c._id, e.target.value)}
                                                style={{ padding: '0.4rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.875rem' }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Assigned">Assigned</option>
                                                <option value="Investigating">Investigating</option>
                                                <option value="Solved">Solved</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {c.assignedOfficer ? (
                                                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                                        <Shield size={14} style={{ marginRight: '4px', display: 'inline' }} />
                                                        {c.assignedOfficer.name}
                                                    </span>
                                                ) : (
                                                    <select 
                                                        onChange={(e) => handleAssign(c._id, e.target.value)}
                                                        style={{ padding: '0.4rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.875rem', width: '100%' }}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Assign Officer</option>
                                                        {officers.map(o => (
                                                            <option key={o._id} value={o._id}>
                                                                {o.name} {o.availability === 'busy' ? '(Busy)' : '(Free)'}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                alerts.map(a => (
                                    <tr key={a._id} style={{ borderBottom: '1px solid var(--border)', background: 'rgba(239, 68, 68, 0.02)' }}>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--danger)' }}>EMERGENCY ALERT</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{new Date(a.timestamp).toLocaleString()}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div>{a.userId?.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{a.userId?.phone}</div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 500 }}>
                                                <MapPin size={14} />
                                                <a href={`https://www.google.com/maps?q=${a.location.latitude},${a.location.longitude}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.875rem' }}>View on Map</a>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <span className="badge badge-solved" style={{ background: '#fee2e2', color: '#991b1b' }}>CRITICAL</span>
                                        </td>
                                        <td style={{ padding: '1.25rem 1.5rem' }}>
                                            <div style={{ fontWeight: 500 }}>
                                                {a.assignedOfficer ? (
                                                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                                        <Shield size={14} style={{ marginRight: '4px', display: 'inline' }} />
                                                        {a.assignedOfficer.name}
                                                    </span>
                                                ) : (
                                                    <select 
                                                        onChange={(e) => handleEmergencyAssign(a._id, e.target.value)}
                                                        style={{ padding: '0.4rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.875rem', width: '100%' }}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Assign Officer</option>
                                                        {officers.map(o => (
                                                            <option key={o._id} value={o._id}>
                                                                {o.name} {o.availability === 'busy' ? '(Busy)' : '(Free)'}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PoliceDashboard;
