// src/components/FoodCard.js
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const FoodCard = ({ food, onOrder }) => (
  <Card style={{ width: '22rem', margin: '10px' }} id="cards">
    <Card.Img variant="top" id="food-img" src={food.imageUrl} alt={food.name} />
    <Card.Body>
      <Card.Title>{food.name}</Card.Title>
      <p>₹{food.price}</p>
      <Card.Text>{food.description}</Card.Text>
      <Button variant="primary" onClick={() => onOrder(food)}>
        Order NOW
      </Button>
    </Card.Body>
  </Card>
);

export default FoodCard;
