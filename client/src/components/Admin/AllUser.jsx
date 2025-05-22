import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import './AllUser.css'; // New CSS file for styles

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found. Please log in as admin.');

        const res = await API.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="allusers-container">
      <header className="allusers-header">
        <h1>👥 All Users</h1>
        <span className="user-count">Total Users: <strong>{users.length}</strong></span>
      </header>

      {loading ? (
        <p className="loading-text">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="no-users-text">No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td className="user-id">{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.phone || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllUsers;
