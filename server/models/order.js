const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  tableNumber: { type: Number, required: true },
  orderDate: { type: Date, required: true },
  customizationNote: { type: String },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Preparing', 'Delivered', 'Cancelled']},
  billStatus: { type: String, default: 'Pending', enum: ['Paid','Pending']}
});

module.exports = mongoose.model('Order', orderSchema);
