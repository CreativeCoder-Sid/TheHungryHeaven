import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios'; // Adjust the path as needed

const ReviewForm = () => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || name.trim() === '') {
      alert('Please enter your name and select a rating.');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        name,
        rating,
        comment,
        date: new Date().toISOString(),
      };

      await API.post('/reviews', reviewData);
      alert('Thank you for your review!');
      navigate('/'); // Navigate to home page
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert('Failed to submit review. Please try again later.');
    }
    setSubmitting(false);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '550px',
        margin: 'auto',
        padding: '80px',
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        borderRadius: '16px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        fontFamily: 'Poppins, sans-serif',
        color: '#444',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#6a11cb', marginBottom: '30px' }}>🌟 Leave a Review</h2>

      {/* Name Input */}
      <div style={{ marginBottom: '25px' }}>
        <label htmlFor="name" style={{ fontWeight: '600', fontSize: '16px' }}>Your Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '15px',
            fontFamily: 'inherit',
            marginTop: '10px',
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />
      </div>

      {/* Star Rating */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontWeight: '600', fontSize: '16px' }}>Your Rating:</label>
        <div style={{ fontSize: '32px', marginTop: '10px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s, color 0.2s',
                transform: (hoverRating || rating) >= star ? 'scale(1.2)' : 'scale(1)',
                color: (hoverRating || rating) >= star ? '#ff9800' : '#cfd8dc',
                marginRight: '5px',
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Review Comment */}
      <div style={{ marginBottom: '25px' }}>
        <label htmlFor="comment" style={{ fontWeight: '600', fontSize: '16px' }}>Your Review:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          placeholder="Write your thoughts here..."
          required
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            resize: 'none',
            fontSize: '15px',
            fontFamily: 'inherit',
            marginTop: '10px',
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        style={{
          width: '100%',
          padding: '14px',
          background: submitting
            ? 'linear-gradient(90deg, #a1c4fd 0%, #c2e9fb 100%)'
            : 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: submitting ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease-in-out',
          marginBottom: '15px',
        }}
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>

      {/* Cancel Button */}
      <button
        type="button"
        onClick={handleCancel}
        style={{
          width: '100%',
          padding: '12px',
          background: '#eee',
          color: '#333',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontSize: '15px',
          cursor: 'pointer',
          transition: 'background 0.3s',
        }}
      >
        Cancel
      </button>
    </form>
  );
};

export default ReviewForm;
