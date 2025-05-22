import React, { useState } from 'react';
import API from '../../api/axios';
import './EditProfileModal.css';

const EditProfileModal = ({ profile, onClose, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
  });
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    // Optional phone validation: digits only, min 7 chars
    if (formData.phone && !/^\d{7,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be at least 7 digits';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await API.put('/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onProfileUpdate(response.data);
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Profile</h3>
        <form onSubmit={handleSubmit} noValidate>
          <label>
            Name:
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <small className="error-text">{errors.name}</small>}
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <small className="error-text">{errors.email}</small>}
          </label>

          <label>
            Phone:
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <small className="error-text">{errors.phone}</small>}
          </label>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}
          {successMsg && <p className="success-msg">{successMsg}</p>}

          <div className="modal-buttons">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
