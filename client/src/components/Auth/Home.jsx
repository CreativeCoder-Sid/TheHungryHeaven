import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import API from '../../api/axios';
import './Home.css';

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get('/reviews');
        // Show latest 4 reviews
        setReviews(res.data.slice(-4).reverse());
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className='homepage'>
      {/* Carousel */}
      <script src="//code.tidio.co/csbsybp0beoklexycjbwtuhzjua8hgzo.js" async></script>
      <div className="carousel-container">
        <Carousel data-bs-theme="dark" fade interval={5000}>
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/front4.jpg" alt="First slide" />
            <Carousel.Caption className="carousel-caption">
              <h3>Welcome to The Hungry Heaven</h3>
              <p>A cozy place with delightful dishes awaits you.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/front1.jpg" alt="Second slide" />
            <Carousel.Caption className="carousel-caption">
              <h3>Discover Diverse Cuisines</h3>
              <p>From Bengali to South Indian and Chinese flavors.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100 carousel-img" src="/front2.jpg" alt="Third slide" />
            <Carousel.Caption className="carousel-caption">
              <h3>Make Delicious Memories</h3>
              <p>Quality food, friendly service, and warm ambiance.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Welcome Section */}
      <div id="welcome-note">
        <div className="welcome-note1">
          <p id="notes">
            <h3>Welcome To</h3>
            <h1>THE HUNGRY HEAVEN</h1>
            <img src="/shape2.png" alt="" />
            <br />
            The Hungry Heaven has been serving delightful experiences through the art of cooking for four decades.
            A cozy, relaxing space combined with flavourful dishes makes it a first choice for every foodie in town.
            <br /><br />
            We provide a wide range of cuisines and dishes so that every foodie in town has their best experience here.
            We have always won the hearts of our customers with appetizing dishes and friendly behavior.
            It is the best choice for those who want to enjoy quality food at reasonable prices.
          </p>
        </div>
        <div className="welcome-note2">
          <img src="/welcomeimg.png" id="welc-img" alt="" />
        </div>
      </div>

      {/* Tagline */}
      <div id="transparentdiv">
        <h6>We Create Delicious Memories</h6>
        <h1>Eat Good Feel Good</h1>
      </div>

      {/* Speciality Section */}
      <div id="our_special">
        <h6>The Hungry Heaven</h6>
        <h1>Our Speciality</h1>
        <img src="/shape2.png" alt="" />
        <p>We provide a wide range of cuisines and dishes to choose from so that every foodie in town has their best experience with us.</p>

        <div id="specialMenu">
          <div id="specialMenu1">
            <a href="/Bengali"><img src="/bengali-combo.jpg" alt="Bengali Combo" /></a>
            <div className="specialMenu1div"><h2>Bengali</h2></div>
          </div>
          <div id="specialMenu1">
            <a href="/South"><img src="/south_indian.webp" alt="South Indian" /></a>
            <div className="specialMenu1div"><h2>South Indian</h2></div>
          </div>
          <div id="specialMenu1">
            <a href="/Chinese"><img src="/chinese.webp" alt="Chinese" /></a>
            <div className="specialMenu1div"><h2>Chinese</h2></div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="booktable">
        <h5>Customer Feedback</h5>
        <h1>Recent Reviews</h1>
        <img src="/shape2.png" alt="" />
        <p>Here's what our customers have to say!</p>

        <div className="reviews-grid">
          {reviews.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888' }}>
              No reviews yet.
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="review-card">
                <h4>👤 {review.name || 'Anonymous'}</h4>

                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={review.rating >= star ? 'filled' : ''}>
                      ★
                    </span>
                  ))}
                </div>

                <p className="comment">"{review.comment}"</p>

                <p className="date">{new Date(review.date).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

        <div className="review-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate('/review')}
            aria-label="Give a review"
          >
            ✍️ Give a Review
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate('/all-reviews')}
            aria-label="See more reviews"
          >
            👀 See More Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
