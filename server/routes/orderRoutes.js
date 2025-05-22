const express = require('express');
const router = express.Router();
const { payBill } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const verifyAdmin = require('../middleware/verifyAdmin');

const {
  placeOrder,
  getAllOrders,
  deleteOrder,
  updateOrderStatus,
  updateOrder,
  cancelOrder,
  markBillAsPaid,
  getAllOrdersAdmin // New controller to handle full update (e.g., customizationNote)
} = require('../controllers/orderController');

router.post('/', auth, placeOrder);
// Mark today's orders as paid for the logged-in user
router.patch('/mark-paid', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderIds } = req.body; // Array of order IDs to mark as paid

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No order IDs provided' });
    }

    // Filter so user can only update their own orders which are not cancelled and not already paid
    const filter = {
      _id: { $in: orderIds },
      userId,
      billStatus: { $ne: 'Paid' },
      status: { $ne: 'Cancelled' },
    };

    const result = await Order.updateMany(filter, { $set: { billStatus: 'Paid' } });

    if (result.modifiedCount === 0) {
      return res.status(400).json({ success: false, message: 'No valid orders updated' });
    }

    res.json({ success: true, modifiedCount: result.modifiedCount, message: 'Selected orders marked as paid' });
  } catch (err) {
    console.error('Error updating bill status:', err);
    res.status(500).json({ success: false, message: 'Error updating bill status' });
  }
});

// GET all orders (admin access or restricted if needed)
router.get('/', auth, getAllOrders);

// DELETE an order by ID
router.delete('/:id', auth, deleteOrder);

// PATCH order status only
router.patch('/:id/status', auth, updateOrderStatus);
router.patch('/order/paybill', auth,markBillAsPaid);  // Specific route first
router.patch('/order/:id', updateOrder);   
// PATCH full order update (e.g., customizationNote, quantity, etc.)
router.patch('/:id', auth, updateOrder);
router.patch('/:id/cancel', auth,cancelOrder);
router.patch('/paybill', auth,markBillAsPaid);

router.get('/admin/all-orders', verifyAdmin, getAllOrdersAdmin);

module.exports = router;
