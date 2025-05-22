import { useEffect, useState } from 'react';
import API from '../../api/axios';
import './MyOrdersPage.css';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../../components/Auth/PaymentModal';

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to view your orders.');
        navigate('/login');
        return;
      }

      try {
        const response = await API.get('/order', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError('Failed to load orders.');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancel = async (orderId, status, billStatus) => {
    if (billStatus === 'Paid') {
      return alert('Cannot cancel an order with a paid bill.');
    }

    if (status !== 'Pending') {
      return alert(`Cannot cancel an order which is already ${status}.`);
    }

    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmCancel) return;

    const token = localStorage.getItem('token');
    if (!token) return alert('Please login.');

    try {
      const response = await API.patch(`/order/${orderId}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        alert('Order cancelled successfully.');
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: 'Cancelled' } : order
          )
        );
      } else {
        alert('Cancellation failed.');
      }
    } catch (err) {
      console.error('Cancel failed:', err);
      alert('Cancel failed: ' + err.message);
    }
  };

  const handlePayBill = () => {
    setShowPaymentModal(true);
  };

  const isToday = (dateStr) => {
    const orderDate = new Date(dateStr);
    const today = new Date();
    return (
      orderDate.getFullYear() === today.getFullYear() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getDate() === today.getDate()
    );
  };

  const todayOrdersForBill = orders.filter(
    (order) =>
      isToday(order.orderDate) &&
      order.status !== 'Cancelled' &&
      order.billStatus !== 'Paid'
  );

  const totalWithoutGST = todayOrdersForBill.reduce((sum, order) => sum + order.price, 0);
  const gstAmount = totalWithoutGST * 0.18;
  const totalWithGST = totalWithoutGST + gstAmount;

  const handlePaymentSuccess = async () => {
  const token = localStorage.getItem('token');
  if (!token) return alert('Please login.');

  try {
    const orderIdsToPay = todayOrdersForBill.map((order) => order._id);

    const response = await API.patch(
      '/mark-paid',
      { orderIds: orderIdsToPay }, // send orderIds in request body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      alert(`Bill paid successfully for ${response.data.modifiedCount} orders.`);

      const updatedOrders = orders.map((order) => {
        if (orderIdsToPay.includes(order._id)) {
          return { ...order, billStatus: 'Paid' };
        }
        return order;
      });

      setOrders(updatedOrders);
      setShowPaymentModal(false);
      downloadBill(todayOrdersForBill, totalWithoutGST, gstAmount, totalWithGST);
    } else {
      alert('Payment failed.');
    }
  } catch (err) {
    console.error('Payment failed:', err);
    alert('Payment failed: ' + err.message);
  }
};


  const downloadBill = (orders, subtotal, gst, total) => {
    let billContent = `🧾 The Hungry Heaven Bill\n\nOrders:\n`;

    orders.forEach((order, index) => {
      billContent += `${index + 1}. ${order.foodName} x${order.quantity} - ₹${order.price}\n`;
    });

    billContent += `\nSubtotal: ₹${subtotal.toFixed(2)}\n`;
    billContent += `GST (18%): ₹${gst.toFixed(2)}\n`;
    billContent += `Total: ₹${total.toFixed(2)}\n`;
    billContent += `\nThank you for dining with us!`;

    const blob = new Blob([billContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Restaurant_Bill.txt';
    link.click();
  };

  if (loading) return <div className="orders-loading">Loading your orders...</div>;
  if (error) return <div className="orders-error">{error}</div>;
  if (orders.length === 0) return <div className="orders-empty">You have no orders yet.</div>;

  return (
    <div className="my-orders-container">
      <h1>Your Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <img src={order.image} alt={order.foodName} className="order-img" />
            <div className="order-details">
              <h3>{order.foodName}</h3>
              <p>Quantity: {order.quantity}</p>
              <p>Total Price: ₹{order.price}</p>
              <p>Table: {order.tableNumber}</p>
              <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
              {order.customizationNote && <p>Note: {order.customizationNote}</p>}
              <p>Status: {order.status || 'Pending'}</p>
              <p>
                Bill Status:{' '}
                <span
                  style={{
                    color: order.billStatus === 'Paid' ? 'green' : 'crimson',
                    fontWeight: 'bold',
                  }}
                >
                  {order.billStatus || 'Pending'}
                </span>
              </p>

              {order.status === 'Pending' && order.billStatus !== 'Paid' ? (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(order._id, order.status, order.billStatus)}
                >
                  Cancel Order
                </button>
              ) : (
                <button className="cancel-btn disabled" disabled>
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pay Bill Section */}
      {todayOrdersForBill.length > 0 && (
        <div className="pay-bill-summary">
          <h2>Pending Bill Summary</h2>
          <p>Subtotal: ₹{totalWithoutGST.toFixed(2)}</p>
          <p>GST (18%): ₹{gstAmount.toFixed(2)}</p>
          <h3>Total Payable: ₹{totalWithGST.toFixed(2)}</h3>
          <button className="pay-button" onClick={handlePayBill}>
            Pay Bill
          </button>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          totalAmount={totalWithGST}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}

export default MyOrdersPage;
