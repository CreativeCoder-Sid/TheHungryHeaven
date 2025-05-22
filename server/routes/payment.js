// routes/payment.js
const express = require('express');
const router = express.Router();

// Dummy Payment API
router.post('/dummy', (req, res) => {
  const { amount } = req.body;

  // Simulate delay and fake transaction ID
  const transactionId = 'TXN' + Date.now();

  return res.status(200).json({
    success: true,
    transactionId,
    amount,
    message: 'Payment simulated successfully',
  });
});

module.exports = router;
