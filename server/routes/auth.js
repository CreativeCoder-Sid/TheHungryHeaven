const User = require('../models/User');
const Order = require('../models/order');

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TableBooking = require('../models/Booking');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require('../middleware/verifyAdmin');

// GET all users
router.get('/users', auth, admin, async (req, res) => {
  const users = await User.find().select('-password'); // exclude passwords
  res.json(users);
});

// UPDATE user
router.put('/users/:id', auth, admin, async (req, res) => {
  const { name, email, role } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    { new: true }
  );
  res.json(updatedUser);
});

// DELETE user
router.delete('/users/:id', auth, admin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});




// Create a table booking (User)
router.post('/book-table', auth, async (req, res) => {
  try {
    const { name, email, phone, date, time, guests } = req.body;
    const booking = new TableBooking({
      userId: req.user.id,
      name,
      email,
      phone,
      date,
      time,
      guests
    });
    await booking.save();
    res.status(201).json({ message: 'Booking successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user's bookings
router.get('/bookings', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await TableBooking.find({ userId });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to get bookings' });
  }
});
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone,} = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone
    });

    await user.save();

    const token = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email,phone:user.phone },
    });

  } catch (err) {
    console.error('❌ Signup error:', err);  // <-- THIS LINE shows the real error in terminal
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email,role:user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/order', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching orders for userId:", userId);

    // Check if userId is a valid ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // DEBUG ONLY: log all orders to verify structure
    const allOrders = await Order.find({});
    console.log("All orders in DB:", allOrders);

    // Actual logic
    const orders = await Order.find({ userId }); // This line might be failing
    console.log("Filtered orders for user:", orders);

    res.json(orders);
  } catch (error) {
    console.error("Error in /order route:", error);
    res.status(500).json({
      error: "Failed to fetch orders",
      message: error.message,
      stack: error.stack,
    });
  }
});
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get profile' });
  }
});
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;  // assuming JWT contains `id`
    const { name, email, phone } = req.body;

    // Optional: Validate fields here (e.g., email format)

    // Check if the email is already taken by another user (if email update allowed)
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use by another account' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password'); // exclude password from returned data

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});
router.patch('/mark-paid', auth, async (req, res) => {
  try {
    await Order.updateMany({ userId: req.user.id }, { $set: { billStatus: 'Paid' } });
    res.json({ success: true, message: 'Orders marked as paid' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating bill status' });
  }
});







// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if all fields are provided
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     await user.save();

//     // Optionally generate JWT
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '1d',
//     });

//     res.status(201).json({
//       message: 'User created successfully',
//       token,
//       user: { id: user._id, name: user.name, email: user.email },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

module.exports = router;



