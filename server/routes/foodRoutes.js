// routes/foodRoutes.js
const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// GET /api/foods/
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    console.error('Error fetching food items:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/foods/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const foods = await Food.find({ category: req.params.category });
    res.json(foods);
  } catch (err) {
    console.error('Error fetching foods by category:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/foods/search?query=biryani
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    
    if (!query) return res.status(400).json({ message: 'Query required' });

    const results = await Food.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/foods/:id
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Food not found' });
    res.json(food);
  } catch (err) {
    console.error('Error fetching food by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
