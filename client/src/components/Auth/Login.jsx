import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user, message } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setMessage(`✅ Login successful. Welcome, ${user.name}`);

      setTimeout(() => {
        navigate('/');
      }, 1200);
    } catch (error) {
      if (error.response) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage('❌ Something went wrong. Try again.');
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to continue to The Hungry Heaven</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
            autoComplete="current-password"
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        {message && <p style={{ ...styles.message, color: message.startsWith('❌') ? '#e74c3c' : '#2ecc71' }}>{message}</p>}
      </div>
      <div style={styles.backgroundBlobs}>
        <div style={{ ...styles.blob, ...styles.blob1 }} />
        <div style={{ ...styles.blob, ...styles.blob2 }} />
        <div style={{ ...styles.blob, ...styles.blob3 }} />
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    padding: '3rem 3.5rem',
    maxWidth: '420px',
    width: '100%',
    color: '#fff',
    zIndex: 10,
    textAlign: 'center',
    transition: 'all 0.4s ease',
  },
  title: {
    fontSize: '2.8rem',
    marginBottom: '0.2rem',
    fontWeight: '900',
    letterSpacing: '2px',
    textShadow: '0 0 8px rgba(255, 255, 255, 0.7)',
  },
  subtitle: {
    fontSize: '1.1rem',
    marginBottom: '2.5rem',
    color: '#e0e0e0',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  input: {
    padding: '1.1rem 1.3rem',
    borderRadius: '12px',
    border: 'none',
    fontSize: '1.1rem',
    outline: 'none',
    background: 'rgba(255, 255, 255, 0.25)',
    color: '#fff',
    boxShadow: 'inset 0 0 8px rgba(255, 255, 255, 0.3)',
    transition: 'background 0.3s ease, box-shadow 0.3s ease',
    fontWeight: '600',
  },
  button: {
    marginTop: '1rem',
    padding: '1.1rem 0',
    borderRadius: '15px',
    border: 'none',
    background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    color: '#2c2c2c',
    fontSize: '1.3rem',
    fontWeight: '900',
    letterSpacing: '1.2px',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(255, 210, 0, 0.6)',
    transition: 'background 0.4s ease, box-shadow 0.4s ease',
  },
  message: {
    marginTop: '1.5rem',
    fontWeight: '700',
    fontSize: '1.1rem',
    textShadow: '0 0 4px rgba(0,0,0,0.3)',
  },
  backgroundBlobs: {
    position: 'absolute',
    top: '-150px',
    right: '-150px',
    width: '600px',
    height: '600px',
    pointerEvents: 'none',
    zIndex: 5,
  },
  blob: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.6,
    animation: 'blobMove 15s infinite alternate ease-in-out',
  },
  blob1: {
    width: '300px',
    height: '300px',
    background: '#ff6a00',
    top: '0',
    left: '0',
    animationDelay: '0s',
  },
  blob2: {
    width: '350px',
    height: '350px',
    background: '#ee0979',
    top: '150px',
    left: '150px',
    animationDelay: '5s',
  },
  blob3: {
    width: '250px',
    height: '250px',
    background: '#ffd200',
    top: '100px',
    left: '300px',
    animationDelay: '10s',
  },
};

// Keyframes need to be added globally, you can add this in your main CSS file or use styled-components:

/*
@keyframes blobMove {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(20px, -30px) scale(1.1);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}
*/

export default Login;
