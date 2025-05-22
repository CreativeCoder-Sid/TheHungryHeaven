import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import API from "../../api/axios.js"; // Axios instance
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const [quantity, setQuantity] = useState(1);
  const [tableNumber, setTableNumber] = useState("");
  const [customizationNote, setCustomizationNote] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedFood } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedFood) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>No food item selected.</h2>
        <button onClick={() => navigate('/south-indian')}>Back to Menu</button>
      </div>
    );
  }

  const handleConfirmOrder = async () => {
    if (!tableNumber) {
      alert('Please select a table number.');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      foodName: selectedFood.name,
      quantity,
      price: selectedFood.price * quantity,
      image: selectedFood.image,
      tableNumber: Number(tableNumber),
      orderDate: new Date().toISOString(),
      customizationNote,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to be logged in to place an order.');
        navigate('/login');
        return;
      }

      const response = await API.post('/order', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        alert('Order placed successfully!');
        navigate('/my-orders');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response) {
        alert(`Error: ${error.response.status} - ${error.response.data.message || 'Server error'}`);
      } else if (error.request) {
        alert('No response from server. Please try again later.');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-confirmation">
      <h1>Order Confirmation</h1>

      <div>
        <img src={selectedFood.image} alt={selectedFood.name} style={{ width: '100%', height: 'auto' }} />
        <h2>{selectedFood.name}</h2>
        <p>Price: ₹{selectedFood.price}</p>

        <label htmlFor="quantity">Select Quantity:</label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          {[...Array(10).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>
              {num + 1}
            </option>
          ))}
        </select>

        <label htmlFor="tableNumber">Select Table Number:</label>
        <select
          id="tableNumber"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        >
          <option value="">Select Table</option>
          {[...Array(20).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>
              Table {num + 1}
            </option>
          ))}
        </select>

        <label htmlFor="customizationNote">Customization (optional):</label>
        <textarea
          id="customizationNote"
          value={customizationNote}
          onChange={(e) => setCustomizationNote(e.target.value)}
          placeholder="Any special requests?"
        />

        <p>Total Price: ₹{selectedFood.price * quantity}</p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.5 : 1 }}
          >
            {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
          </button>

          <button
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
