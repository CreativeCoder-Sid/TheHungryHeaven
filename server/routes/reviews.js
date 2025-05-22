const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    // Get userId from token payload
    const userId = req.user.id;

    const { name,rating, comment } = req.body;

    if (!rating || !comment || !name) {
      return res.status(400).json({ message: 'Missing rating or comment or name' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const newReview = new Review({
      name,
      userId,
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (err) {
    console.error('Error saving review:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 }) .populate('userId', 'name')  
      .exec();  
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
