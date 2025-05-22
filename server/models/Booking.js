const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  email: String,
  phone: String,
  date: String, // format: YYYY-MM-DD
  fromTime: String, // format: HH:mm
  toTime: String,   // format: HH:mm
  guests: Number,
  tableNumber: Number,
  bookingId: String,
});

module.exports = mongoose.model('Booking', bookingSchema);
