// routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth'); // Ensure correct path

router.post('/check-availability', bookingController.checkAvailability);
router.post('/', authMiddleware, bookingController.bookTable); // 🔒 Requires login
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id; // Assuming your auth middleware sets req.user

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow the owner or admin to delete
    if (booking.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    // Delete booking
    await Booking.findByIdAndDelete(bookingId);

    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ message: 'Server error while deleting booking' });
  }
});

module.exports = router;
