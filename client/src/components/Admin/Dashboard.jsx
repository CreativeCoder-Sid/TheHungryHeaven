import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/adminLogin');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        <h2 className="dashboard-title">👨‍💼 Admin Dashboard</h2>
        <div className="dashboard-buttons">
          <button onClick={() => navigate('/admin/all-foods')} className="dash-btn">Manage Foods</button>
          <button onClick={() => navigate('/admin/users')} className="dash-btn">Manage Users</button>
          <button onClick={() => navigate('/admin/all-orders')} className="dash-btn">View Orders</button>
          <button onClick={() => navigate('/admin/bookings')} className="dash-btn">View Bookings</button>
          <button onClick={() => navigate('/all-reviews')} className="dash-btn">All Reviews</button> {/* New button */}
        </div>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
