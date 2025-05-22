const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating) {
      return res.status(400).json({ error: 'Rating is required' });
    }

    const newReview = new Review({
      user: userId,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
