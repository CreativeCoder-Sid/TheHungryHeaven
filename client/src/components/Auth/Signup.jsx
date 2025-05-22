import React, { useState } from 'react';
import API from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/signup', formData);
      alert('Signup successful. Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cute-signup-container">
      <form className="cute-signup-form" onSubmit={handleSubmit} noValidate>
        <h2 className="cute-title">🎀 Join Us 🎀</h2>
        {error && <p className="cute-error">{error}</p>}
        <div className="cute-input-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
         
        </div>
        <div className="cute-input-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          
        </div>
        <div className="cute-input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          
        </div>
        <div className="cute-input-group">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete="tel"
            pattern="[0-9]{10,15}"
            title="Please enter a valid phone number"
          />
          
        </div>
        <button type="submit" className="cute-btn" disabled={loading}>
          {loading ? 'Creating magic...' : 'Sign me up 💖'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
