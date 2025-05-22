import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

const OrderManagement = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [billStatus, setBillStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalAmountAllOrders, setTotalAmountAllOrders] = useState(0);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/admin/all-orders');
      const orders = Array.isArray(res.data.orders) ? res.data.orders : [];

      const grouped = {};
      const billStatusObj = {};

      orders.forEach(order => {
        const key = order.userId?._id || 'Unknown';
        if (!grouped[key]) grouped[key] = { user: order.userId, orders: [] };
        grouped[key].orders.push(order);

        if (!(key in billStatusObj)) {
          billStatusObj[key] = order.billStatus || 'Pending';
        }
      });

      setGroupedOrders(grouped);
      setBillStatus(billStatusObj);
    } catch (err) {
      console.error('Error fetching orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.patch(`/order/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleBillStatusChange = async (userId) => {
    if (!window.confirm('Are you sure you want to mark all orders as Paid for this user?')) return;
    try {
      await API.patch(`/admin/order/bill/${userId}/mark-paid`);
      fetchOrders();
    } catch (err) {
      console.error('Failed to update bill status:', err);
    }
  };

  const generatePendingBill = async (userId) => {
    try {
      const res = await API.get(`/admin/order/bill/${userId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `User-${userId}-PendingBill.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to generate pending bill:', err);
    }
  };

  const generateOldBillByDate = async (userId) => {
    if (!dateRange.from || !dateRange.to) return alert('Please select both From and To dates');

    try {
      const res = await API.get(
        `/admin/order/bill/${userId}/paid?from=${dateRange.from}&to=${dateRange.to}`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `User-${userId}-OldBill.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to generate old bill:', err);
    }
  };

  const emailBill = async (userId) => {
    try {
      await API.post(`/admin/order/email-bill/${userId}`);
      alert('Bill emailed successfully!');
    } catch (err) {
      console.error('Failed to email bill:', err);
    }
  };

  const calculateTotalAmountAllOrders = () => {
    const totalAmount = Object.values(groupedOrders).flatMap(g => g.orders)
      .filter(order => order.status !== 'Cancelled' && order.billStatus !== 'Paid')
      .reduce((sum, order) => {
        const subTotal = order.price * order.quantity;
        const gst = subTotal * 0.18;
        return sum + subTotal + gst;
      }, 0);
    setTotalAmountAllOrders(totalAmount);
  };

  useEffect(() => {
    calculateTotalAmountAllOrders();
  }, [groupedOrders]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">📋 Order Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="text-sm text-gray-600">From Date</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">To Date</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {Object.entries(groupedOrders).map(([key, group]) => {
        const { user, orders } = group;
        const validOrders = orders.filter(o => o.status !== 'Cancelled' && o.billStatus !== 'Paid');
        const subTotal = validOrders.reduce((sum, o) => sum + o.price * o.quantity, 0);
        const gst = subTotal * 0.18;
        const grandTotal = subTotal + gst;

        return (
          <div key={key} className="bg-white border rounded-lg shadow-sm mb-10 p-6">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800">{user?.name || 'Unknown User'}</h3>
                <p className="text-sm text-gray-500">{user?.email || 'No email'}</p>
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  billStatus[key] === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {billStatus[key] === 'Paid' ? 'Paid' : 'Pending'}
                </span>
                {billStatus[key] !== 'Paid' && (
                  <button
                    onClick={() => handleBillStatusChange(key)}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Mark Paid
                  </button>
                )}
                <button
                  onClick={() => generatePendingBill(key)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1 rounded"
                >
                  Print
                </button>
                <button
                  onClick={() => generateOldBillByDate(key)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
                >
                  Old Bill
                </button>
                <button
                  onClick={() => emailBill(key)}
                  className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-3 py-1 rounded"
                >
                  Email
                </button>
              </div>
            </div>

            <div className="overflow-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-50 text-gray-600 border-b">
                  <tr>
                    <th className="py-2 px-3">Order ID</th>
                    <th>Food</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Note</th>
                    <th>Bill</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="py-2 px-3">{order._id}</td>
                      <td>{order.foodName}</td>
                      <td>{order.quantity}</td>
                      <td>₹{order.price}</td>
                      <td>₹{(order.price * order.quantity).toFixed(2)}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="text-sm border px-2 py-1 rounded"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Prepearing">Prepearing</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{order.customizationNote || '—'}</td>
                      <td>{order.billStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-right text-sm">
              <p>Subtotal: ₹{subTotal.toFixed(2)}</p>
              <p>GST (18%): ₹{gst.toFixed(2)}</p>
              <p className="font-semibold text-lg mt-1">Total: ₹{grandTotal.toFixed(2)}</p>
            </div>
          </div>
        );
      })}

      <div className="text-right mt-6 text-xl font-semibold text-indigo-700">
        Total Revenue: ₹{totalAmountAllOrders.toFixed(2)}
      </div>
    </div>
  );
};

export default OrderManagement;
