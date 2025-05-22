// src/pages/FoodPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FoodCard from '../components/FoodCard';

const FoodPage = ({ title, subtitle, items }) => {
  const navigate = useNavigate();
  const handleOrderNow = (food) =>
    navigate('/order-confirmation', { state: { selectedFood: food } });

  return (
    <div className="food-category">
      <h1>{title}</h1>
      <h3>{subtitle}</h3>
      <div className="d-flex justify-content-around flex-wrap" data-aos="fade-up">
        {items.map((food, i) => (
          <FoodCard key={i} food={food} onOrder={handleOrderNow} />
        ))}
      </div>
    </div>
  );
};

export default FoodPage;
