import React, { useState } from 'react';
import './PaymentModal.css';

function PaymentModal({ totalAmount, onSuccess, onClose }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCardInput = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(value);
  };

  const handlePay = () => {
    if (!cardNumber || !expiry || !cvv || !name) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setPaid(true);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onSuccess(); // notify parent
      }, 1500);
    }, 2000);
  };

  return (
    <div className="modal-backdrop">
      <div className="payment-modal">
        <h2>Pay ₹{totalAmount.toFixed(2)}</h2>

        <div className="card-preview">
          <div className="chip" />
          <div className="card-number">{cardNumber || '#### #### #### ####'}</div>
          <div className="card-bottom">
            <span>{name || 'Card Holder'}</span>
            <span>{expiry || 'MM/YY'}</span>
          </div>
        </div>

        <div className="card-form">
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardInput}
            placeholder="Card Number"
            maxLength={19}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cardholder Name"
          />
          <div className="row">
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
            />
            <input
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="CVV"
              maxLength={3}
            />
          </div>

          <button onClick={handlePay} disabled={loading || paid}>
            {loading ? 'Processing...' : paid ? 'Paid ✅' : 'Pay Now'}
          </button>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>

      {showSuccess && (
        <div className="success-popup">
          <div className="checkmark">✔</div>
          <p>Payment Successful!</p>
        </div>
      )}
    </div>
  );
}

export default PaymentModal;
