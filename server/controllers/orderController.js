const Order = require('../models/order');

// Create a new order
exports.placeOrder = async (req, res) => {
   
  try {
    const {
      foodName,
      quantity,
      price,
      image,
      tableNumber,
      orderDate,
      customizationNote,
    } = req.body;
    
if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const newOrder = new Order({
      foodName,
      quantity,
      price,
      image,
      tableNumber,
      orderDate,
      userId: req.user.id, // assuming auth middleware sets req.user
      customizationNote: customizationNote || '',
    });

    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id; // From token middleware
    const orders = await Order.find({ userId }).populate('userId', 'name email');
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};


// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
};

// Update order status only
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

// Full update of order (e.g., customizationNote, quantity, etc.)
exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const updateData = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
};
exports.cancelOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order cancelled successfully', order: updated });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};
const markBillAsPaid = async (req, res) => {
  try {
    // If userId in body, admin is marking paid for that user
    // else mark paid for the logged-in user
    const userId = req.body.userId || req.user._id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const result = await Order.updateMany(
      { userId, billStatus: { $ne: 'Paid' }, status: { $ne: 'Cancelled' } },
      { $set: { billStatus: 'Paid' } }
    );

    res.status(200).json({ success: true, message: 'Bill marked as paid.', modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error in markBillAsPaid:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get all orders - Admin Access
exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email');
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching all admin orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};
exports.payBill = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Order.updateMany(
      {
        user: userId,
        orderDate: { $gte: today },
        status: { $ne: 'Cancelled' },
        billStatus: { $ne: 'Paid' },
      },
      { $set: { billStatus: 'Paid' } }
    );

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('Pay bill error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.markBillAsPaid = markBillAsPaid;
