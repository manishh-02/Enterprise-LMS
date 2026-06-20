import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Check the browser's pocket for the VIP Badge and User info
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        // 2. If no token is found, kick them back to the login page
        if (!token || !storedUser) {
            navigate('/login');
        } else {
            // Parse the stringified user object back to JSON
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        // Clear the pocket and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Prevent rendering until user data is loaded
    if (!user) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</p>;

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#1e3a8a', textAlign: 'center' }}>Welcome to LMS Dashboard</h1>
            
            <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#0f766e' }}>User Profile Details:</h3>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button 
                    onClick={handleLogout} 
                    style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#dc2626', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;