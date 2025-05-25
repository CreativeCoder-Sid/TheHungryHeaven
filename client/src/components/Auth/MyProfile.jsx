import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import EditProfileModal from './EditProfileModal';
import './Profile.css';
import { FaEdit, FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="loading">Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profile-container">
      <div className="profile-card glass-effect">
        <FaUserCircle className="avatar-icon" />
        <h2 className="profile-title">My Profile</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
        <button className="edit-btn" onClick={() => setIsEditOpen(true)}>
          <FaEdit style={{ marginRight: '8px' }} /> Edit Profile
        </button>
      </div>

      {isEditOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditOpen(false)}
          onProfileUpdate={(updatedProfile) => {
            setProfile(updatedProfile);
            setIsEditOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
