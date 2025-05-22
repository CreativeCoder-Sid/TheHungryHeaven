import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookTableModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const initialForm = {
    name: '',
    email: '',
    phone: '',
    date: '',
    fromTime: '',
    toTime: '',
    guests: 1,
  };

  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [tableNumber, setTableNumber] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem('token');
      if (token) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          setFormData((prev) => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
          }));
        }
      } else {
        setMessage('Please log in to book a table.');
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialForm);
      setMessage('');
      setBookingId(null);
      setTableNumber(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('❌ Please log in first.');
      return;
    }

    try {
      const checkRes = await axios.post(
        'http://localhost:5000/api/bookings/check-availability',
        {
          date: formData.date,
          fromTime: formData.fromTime,
          toTime: formData.toTime,
          guests: formData.guests,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!checkRes.data.available) {
        setMessage('❌ No tables available for the selected time slot.');
        return;
      }

      const res = await axios.post(
        'http://localhost:5000/api/bookings',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { bookingId, tableNumber, pdfUrl } = res.data;
      setBookingId(bookingId);
      setTableNumber(tableNumber);
      setMessage('✅ Table booked successfully!');
      window.open(`http://localhost:5000${pdfUrl}`, '_blank');

      setTimeout(() => {
        onClose();
        navigate('/my-bookings');
      }, 1500);
    } catch (error) {
      console.error('Booking error:', error);
      setMessage('❌ Error booking table. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(255, 213, 200, 0.3)', // warm peach overlay
          zIndex: 999,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          zIndex: 1000,
          padding: '80px 1rem 1rem',
          overflowY: 'auto',
        }}
      >
        <div
          ref={modalRef}
          style={{
            backgroundColor: '#fff1e6',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            maxWidth: '450px',
            width: '100%',
            boxShadow:
              '0 12px 30px rgba(255, 111, 97, 0.3), 0 16px 60px rgba(179, 60, 36, 0.2)',
            border: '2px solid #ff6f61',
            color: '#5b3a29',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            position: 'relative',
            animation: 'fadeIn 0.4s ease-in-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              color: '#ff6f61',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#d85a4d')}
            onMouseLeave={(e) => (e.target.style.color = '#ff6f61')}
            aria-label="Close"
          >
            &times;
          </button>

          <h2
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
              fontWeight: '700',
              fontSize: '2rem',
              color: '#d85a4d',
              textShadow: '0 2px 4px rgba(216, 90, 77, 0.5)',
            }}
          >
            🍽️ Book a Table
          </h2>

          {message && (
            <p
              style={{
                color: message.includes('✅') ? '#2f7a35' : '#b33a27',
                fontWeight: '700',
                textAlign: 'center',
                marginBottom: '1rem',
                fontSize: '1.1rem',
                userSelect: 'none',
              }}
            >
              {message}
            </p>
          )}

          {bookingId && tableNumber && (
            <p
              style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.1rem',
                color: '#7c3a28',
                fontWeight: '600',
              }}
            >
              Your booking ID is <strong>{bookingId}</strong> and table number is{' '}
              <strong>{tableNumber}</strong>.
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Name', name: 'name', type: 'text' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Phone', name: 'phone', type: 'tel' },
              { label: 'Date', name: 'date', type: 'date' },
              { label: 'From Time', name: 'fromTime', type: 'time' },
              { label: 'To Time', name: 'toTime', type: 'time' },
              {
                label: 'No of Guests',
                name: 'guests',
                type: 'number',
                min: 1,
                max: 8,
              },
            ].map(({ label, name, type, ...rest }) => (
              <label
                key={name}
                style={{
                  display: 'block',
                  marginBottom: '1.25rem',
                  fontWeight: '600',
                  color: '#7c3a28',
                }}
              >
                {label}
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '10px',
                    border: '2px solid #ffb3a7',
                    marginTop: '0.4rem',
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: '#ffe6dc',
                    color: '#5b3a29',
                    transition: 'border-color 0.3s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#ff6f61')}
                  onBlur={(e) => (e.target.style.borderColor = '#ffb3a7')}
                  required
                  {...rest}
                />
              </label>
            ))}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '1rem',
                background:
                  'linear-gradient(90deg, #d85a4d 0%, #ff6f61 50%, #ff967d 100%)',
                color: 'white',
                fontWeight: '700',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                boxShadow:
                  '0 4px 12px rgba(255, 111, 97, 0.6), 0 0 15px #d85a4d',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow =
                  '0 6px 18px rgba(255, 111, 97, 0.9), 0 0 25px #b33a27';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow =
                  '0 4px 12px rgba(255, 111, 97, 0.6), 0 0 15px #d85a4d';
              }}
            >
              ✨ Book Table
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100%',
                padding: '1rem',
                marginTop: '1rem',
                backgroundColor: '#ffd7cc',
                color: '#7c3a28',
                fontWeight: '700',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                boxShadow: '0 2px 8px rgba(255, 111, 97, 0.5)',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#ffb3a0')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#ffd7cc')}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default BookTableModal;
