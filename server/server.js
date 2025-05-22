const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const cron = require('node-cron');
const Booking = require('./models/Booking');
const reviewRoute = require('./routes/reviews');
const foodRoutes=require('./routes/foodRoutes');
const paymentRoutes = require('./routes/payment');


// Routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/admin');



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));
app.use('/api/reviews', reviewRoute);
// API Routes
app.use('/order', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api',authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);


app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/foods',foodRoutes);
// ✅ Define this function before using it
const isBookingExpired = (booking) => {
  const bookingTime = new Date(`${booking.date}T${booking.fromTime}`);
  const currentTime = new Date();
  return currentTime > bookingTime;
};

// ⏰ CRON: Every hour at minute 0
cron.schedule('0 * * * *', async () => {
  console.log("Running cron job to delete expired bookings...");
  try {
    const allBookings = await Booking.find();
    const expiredBookings = allBookings.filter(isBookingExpired);

    if (expiredBookings.length > 0) {
      await Booking.deleteMany({ _id: { $in: expiredBookings.map(b => b._id) } });
      console.log(`Deleted ${expiredBookings.length} expired bookings`);
    } else {
      console.log('No expired bookings to delete');
    }
  } catch (err) {
    console.error('Error deleting expired bookings:', err);
  }
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server running on port 5000")))
  .catch(err => console.log("MongoDB connection error:", err));
