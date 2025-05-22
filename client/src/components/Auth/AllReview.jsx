import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllReview.css';

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reviews');
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="reviews-wrapper">
      <h2 className="reviews-title">🌟 All Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet.</p>
      ) : (
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <h4 className="review-user">{review.name || 'Anonymous'}</h4>
                <span className="review-rating">⭐ {review.rating}/5</span>
              </div>
              <p className="review-comment">“{review.comment}”</p>
              <p className="review-date">{new Date(review.date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
