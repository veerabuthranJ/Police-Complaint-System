import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, AlertTriangle, ClipboardList, Clock, CheckCircle, Search, Upload } from 'lucide-react';

const UserDashboard = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [formData, setFormData] = useState({
        name: '', address: '', area: '', pincode: '', phone: ''
    });
    const [proofImage, setProofImage] = useState(null);
    const [incidentImage, setIncidentImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [emergencyLoading, setEmergencyLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/complaints/user');
            setComplaints(res.data);
        } catch (err) {
            console.error('Error fetching complaints:', err);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (proofImage) data.append('proofImage', proofImage);
        if (incidentImage) data.append('incidentImage', incidentImage);

        try {
            await axios.post('http://localhost:5000/api/complaints/submit', data);
            setMessage('Complaint submitted successfully!');
            setFormData({ name: '', address: '', area: '', pincode: '', phone: '' });
            setProofImage(null);
            setIncidentImage(null);
            fetchComplaints();
        } catch (err) {
            setMessage('Failed to submit complaint.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmergency = () => {
        setEmergencyLoading(true);
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            setEmergencyLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const res = await axios.post('http://localhost:5000/api/emergency/alert', {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                alert(`EMERGENCY ALERT SENT! Officer ${res.data.assignedOfficer?.name || 'finding...'} has been notified.`);
            } catch (err) {
                alert("Failed to send emergency alert.");
            } finally {
                setEmergencyLoading(false);
            }
        }, () => {
            alert("Unable to retrieve your location");
            setEmergencyLoading(false);
        });
    };

    return (
        <div className="container fade-in">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>User Dashboard</h1>
                    <p style={{ color: 'var(--secondary)' }}>Welcome back, {user.name} ({user.phone}). Stay safe and updated.</p>
                </div>
                <button 
                    onClick={handleEmergency} 
                    className="btn btn-danger" 
                    style={{ padding: '1.25rem 2rem', borderRadius: '1rem', fontSize: '1.125rem', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)' }}
                    disabled={emergencyLoading}
                >
                    <AlertTriangle size={24} />
                    {emergencyLoading ? 'Sending Alert...' : 'EMERGENCY ALERT'}
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                {/* Complaint Form */}
                <section className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Send className="text-primary" size={24} />
                        <h2 style={{ fontSize: '1.25rem' }}>File a Complaint</h2>
                    </div>
                    {message && <div style={{ background: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{message}</div>}
                    <form onSubmit={handleFormSubmit}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div className="input-group">
                            <label>Contact Phone</label>
                            <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                        </div>
                        <div className="input-group">
                            <label>Address of Incident</label>
                            <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="input-group">
                                <label>Area</label>
                                <input type="text" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Pincode</label>
                                <input type="text" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} required />
                            </div>
                        </div>
                        <div className="input-group">
                            <label>Aadhaar/Voter ID Proof</label>
                            <input type="file" onChange={(e) => setProofImage(e.target.files[0])} required />
                        </div>
                        <div className="input-group">
                            <label>Incident Image (Optional)</label>
                            <input type="file" onChange={(e) => setIncidentImage(e.target.files[0])} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </form>
                </section>

                {/* Case Status */}
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <ClipboardList className="text-primary" size={24} />
                        <h2 style={{ fontSize: '1.25rem' }}>My Complaints</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {complaints.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', color: 'var(--secondary)', padding: '3rem' }}>
                                <Search size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p>No complaints found.</p>
                            </div>
                        ) : (
                            complaints.map(complaint => (
                                <div key={complaint._id} className="card fade-in" style={{ padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Case ID: {complaint._id.substring(18)}</h3>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>{new Date(complaint.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`badge badge-${complaint.status.toLowerCase()}`}>
                                            {complaint.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                                        <div>
                                            <span style={{ color: 'var(--secondary)' }}>Area:</span> {complaint.area}
                                        </div>
                                        <div>
                                            <span style={{ color: 'var(--secondary)' }}>Officer:</span> {complaint.assignedOfficer?.name || 'Not assigned yet'}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserDashboard;
