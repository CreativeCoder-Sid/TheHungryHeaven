import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardText from 'react-bootstrap/esm/CardText';
import "./Chinese.css";
import { useNavigate } from 'react-router-dom';

const Chinese = () => {
  const [foods, setFoods] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const navigate = useNavigate();

  const handleOrderNow = (food) => {
    navigate('/order-confirmation', { state: { selectedFood: food } });
  };

  useEffect(() => {
    const fetchChineseFoods = async () => {
      try {
        const res = await API.get('/foods/category/Chinese');
        setFoods(res.data);
      } catch (error) {
        console.error('Failed to fetch Chinese food items:', error);
      }
    };

    fetchChineseFoods();
  }, []);

  const sortedFoods = [...foods].sort((a, b) => {
    if (sortOption === 'low-to-high') return a.price - b.price;
    if (sortOption === 'high-to-low') return b.price - a.price;
    if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt); // assuming createdAt field exists
    if (sortOption === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  return (
    <div className="Chinese">
      <h1 id='bengali-food-heading' data-aos="zoom-in">Chinese</h1>
      <h3 id="bengali-food-h3" data-aos="zoom-in">You Can Give Your Order Here From Sitting Your Table</h3>

      <div className="d-flex justify-content-end px-4">
        <select 
          className="form-select w-auto mb-4"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="d-flex flex-wrap justify-content-around gap-4 p-4">
        {sortedFoods.map((food, index) => (
          <Card key={index} style={{ width: '22rem' }} id='cards'>
            <Card.Img variant="top" id="food-img" src={food.image} />
            <Card.Body>
              <Card.Title>{food.name}</Card.Title>
              <CardText>₹{food.price}</CardText>
              <Card.Text>{food.description}</Card.Text>
              <Button variant="primary" onClick={() => handleOrderNow(food)}>
                Order NOW
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Chinese;
