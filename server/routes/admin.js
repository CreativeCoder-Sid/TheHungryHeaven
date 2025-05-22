const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const Booking = require('../models/Booking');
const verifyAdmin = require('../middleware/verifyAdmin'); 
const Order = require('../models/order');  // Adjust the path if needed
const User = require('../models/User');
const { getAllOrders, getAllUsers } = require('../controllers/AdminController');



// Admin Routes
router.get('/bookings', verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
const isBookingExpired = (booking) => {
  const bookingTime = new Date(`${booking.date}T${booking.fromTime}`);
  const currentTime = new Date();
  return currentTime > bookingTime;
};

// Route to delete expired bookings
router.delete('/delete-expired', async (req, res) => {
  try {
    // Fetch all bookings
    const allBookings = await Booking.find();

    // Filter out the expired bookings
    const expiredBookings = allBookings.filter((booking) => isBookingExpired(booking));

    if (expiredBookings.length > 0) {
      // Delete expired bookings
      await Booking.deleteMany({ _id: { $in: expiredBookings.map(b => b._id) } });
      res.status(200).json({ message: 'Expired bookings deleted successfully' });
    } else {
      res.status(404).json({ message: 'No expired bookings found' });
    }
  } catch (err) {
    console.error('Error deleting expired bookings:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
// PUT /api/admin/orders/:orderId/status
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// PUT /api/admin/orders/table/:tableNumber/bill
router.put('/orders/table/:tableNumber/bill', async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const { status } = req.body;

    const updated = await Order.updateMany(
      { tableNumber },
      { $set: { billStatus: status } }
    );

    res.json({
      message: `Bill status for table ${tableNumber} set to "${status}"`,
      modifiedCount: updated.modifiedCount,
    });
  } catch (err) {
    console.error('Error updating bill status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// server/routes/admin.js

const Food = require('../models/Food');

// Add new food item
router.post('/add-food', async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving food item', error });
  }
});
router.get('/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    console.error('Error fetching food items:', err);
    res.status(500).json({ message: 'Server error while fetching foods' });
  }
});

// Get food by category
router.get('/foods/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const foods = await Food.find({ category });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching foods' });
  }
});


router.put('/orders/:orderId/status', verifyAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// This must be inside the router for /api/admin (e.g., router = express.Router())
router.patch('/order/bill/:userId/mark-paid',verifyAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all orders for user that are NOT cancelled
    const validOrders = await Order.find({ userId, status: { $ne: 'Cancelled' } });

    if (validOrders.length === 0) {
      return res.status(400).json({ message: 'No valid orders to mark as paid' });
    }

    // Update only valid orders' billStatus to 'Paid'
    await Order.updateMany(
      { userId, status: { $ne: 'Cancelled' } },
      { $set: { billStatus: 'Paid' } }
    );

    res.json({ message: 'Bill status updated to Paid for valid orders' });
  } catch (error) {
    console.error('Error updating bill status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/order/bill/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user info
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    // Fetch orders of this user that are not cancelled
    const orders = await Order.find({ userId, status: { $ne: 'Cancelled' } });

    // Setup PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=User-${userId}-Bill.pdf`);

    // Pipe PDF data to response
    doc.pipe(res);

    // Title
    doc.fontSize(20).text(`Bill for ${user.name}`, { align: 'center' });
    doc.moveDown();

    // User details
    doc.fontSize(12).text(`Email: ${user.email}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Table header
    doc.fontSize(14).text('Orders:', { underline: true });
    doc.moveDown(0.5);

    // Table columns header
    doc.fontSize(12);
    doc.text('Food', 50, doc.y, { continued: true });
    doc.text('Qty', 200, doc.y, { continued: true });
    doc.text('Price', 250, doc.y, { continued: true });
    doc.text('Total', 320, doc.y);
    doc.moveDown(0.5);

    let subTotal = 0;

    orders.forEach(order => {
      const total = order.price * order.quantity;
      subTotal += total;

      doc.text(order.foodName, 50, doc.y, { continued: true });
      doc.text(order.quantity.toString(), 200, doc.y, { continued: true });
      doc.text(`₹${order.price.toFixed(2)}`, 250, doc.y, { continued: true });
      doc.text(`₹${total.toFixed(2)}`, 320, doc.y);
    });

    const gst = subTotal * 0.18;
    const grandTotal = subTotal + gst;

    doc.moveDown(1);
    doc.text(`Subtotal: ₹${subTotal.toFixed(2)}`, { align: 'right' });
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`, { align: 'right' });
    doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, { align: 'right' });

    doc.end();

  } catch (err) {
    console.error('Error generating bill PDF:', err);
    res.status(500).send('Failed to generate bill');
  }
});





router.delete('/foods/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: 'Food not found' });

    res.status(200).json({ message: 'Food deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error while deleting food' });
  }
});
router.put('/foods/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedFood) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});









router.get('/orders', verifyAdmin, getAllOrders);
router.get('/users', verifyAdmin, getAllUsers);

module.exports = router;
