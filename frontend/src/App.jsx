import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import PoliceDashboard from './pages/PoliceDashboard';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
};

const Home = () => {
    const { user } = useAuth();
    if (user?.role === 'police') return <Navigate to="/police-dashboard" />;
    if (user?.role === 'user') return <Navigate to="/user-dashboard" />;
    return <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Navbar />
                    <main style={{ flex: 1, padding: '2rem 0' }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route 
                                path="/user-dashboard" 
                                element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} 
                            />
                            <Route 
                                path="/police-dashboard" 
                                element={<ProtectedRoute role="police"><PoliceDashboard /></ProtectedRoute>} 
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
