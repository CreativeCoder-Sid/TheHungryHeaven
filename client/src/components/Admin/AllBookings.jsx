import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import EmptyState from '../../assets/empty-bookings.svg';
import './AllBookings.css';
const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const isBookingExpired = (booking) => {
    const bookingTime = new Date(`${booking.date}T${booking.fromTime}`);
    return new Date() > bookingTime;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/admin/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const activeBookings = res.data.filter((b) => !isBookingExpired(b));
        setBookings(activeBookings);
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error(err);
      }
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bookings-wrapper">
      <h2 className="bookings-title">📅 All Table Bookings</h2>
      {error && <p className="error-message">{error}</p>}

      {bookings.length === 0 ? (
        <div className="empty-bookings">
          <img src={EmptyState} alt="No Bookings" />
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>👤 Name</th>
                <th>📧 Email</th>
                <th>📱 Phone</th>
                <th>📆 Date</th>
                <th>⏱ From</th>
                <th>⏱ To</th>
                <th>🧍 Guests</th>
                <th>🍽 Table</th>
                <th>🔐 Booking ID</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, index) => (
                <tr key={b._id}>
                  <td>{index + 1}</td>
                  <td>{b.name}</td>
                  <td>{b.email}</td>
                  <td>{b.phone}</td>
                  <td>{b.date}</td>
                  <td>{b.fromTime}</td>
                  <td>{b.toTime}</td>
                  <td>{b.guests}</td>
                  <td>{b.tableNumber}</td>
                  <td className="booking-id">{b.bookingId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
