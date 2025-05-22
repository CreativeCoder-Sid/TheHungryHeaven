import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await API.get(`/foods/${id}`);
        setFood(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load food details.');
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5 pt-5">
        <Spinner animation="border" variant="danger" />
        <p className="mt-3 fs-5 text-secondary">Loading food details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4 text-center fs-5">
        {error}
      </Alert>
    );
  }

  if (!food) {
    return (
      <Alert variant="warning" className="mt-4 text-center fs-5">
        Food item not found.
      </Alert>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '80px' }}>
      <style>{`
        @keyframes slideFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .card-animate {
          animation: slideFadeIn 0.8s ease forwards;
          max-width: 800px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(217, 83, 79, 0.15);
          border: none;
        }
        .food-image {
          width: 100%;
          border-radius: 20px 20px 0 0;
          object-fit: cover;
          max-height: 350px;
        }
        .btn-animate {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          font-weight: 600;
        }
        .btn-animate:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 25px rgba(217, 83, 79, 0.5);
        }
        .category-badge {
          background-color: #fcebea;
          color: #b8393b;
          padding: 5px 14px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.05rem;
          display: inline-block;
          margin-bottom: 1rem;
        }
        .title-text {
          color: #d9534f;
          text-shadow: 1px 1px 5px rgba(217, 83, 79, 0.25);
          font-weight: 700;
        }
        .price-text {
          color: #d9534f;
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .desc-text {
          font-size: 1.1rem;
          line-height: 1.5;
          color: #4a4a4a;
          white-space: pre-wrap;
          margin-bottom: 1.8rem;
        }
      `}</style>

      <div className="row justify-content-center">
        <Card className="card-animate text-center">
          <Card.Img
            variant="top"
            src={food.image}
            alt={food.name}
            className="food-image"
          />
          <Card.Body className="p-4 d-flex flex-column align-items-center">
            <Card.Title as="h2" className="title-text mb-3">
              {food.name}
            </Card.Title>

            <div className="category-badge">{food.category}</div>

            <Card.Text className="desc-text text-center">
              <strong>Description:</strong>
              <br />
              {food.description}
            </Card.Text>

            <Card.Text className="price-text">₹{food.price}</Card.Text>

            <div className="d-flex gap-3 justify-content-center">
              <Button
                variant="outline-danger"
                onClick={() => navigate(-1)}
                className="btn-animate"
              >
                ⬅ Back
              </Button>
              <Button
                variant="danger"
                onClick={() =>
                  navigate('/order-confirmation', {
                    state: { selectedFood: food },
                  })
                }
                className="btn-animate"
              >
                Order Now
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default FoodDetails;
