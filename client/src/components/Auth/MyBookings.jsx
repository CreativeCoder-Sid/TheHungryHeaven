import { useEffect, useState } from "react";
import API from "../../api/axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); // Track which booking is being deleted

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please log in to view your bookings.");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id || user?._id;
        if (!userId) {
          alert("User ID not found.");
          return;
        }

        const res = await API.get("/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userBookings = res.data.filter((booking) => {
          const bookingUserId =
            typeof booking.userId === "object" ? booking.userId._id : booking.userId;
          return bookingUserId === userId;
        });

        setBookings(userBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        alert("Could not load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "Guest";

  // Delete booking handler
  const handleDelete = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeletingId(bookingId);
      const token = localStorage.getItem("token");
      await API.delete(`/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove deleted booking from UI
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      alert("Booking deleted successfully.");
    } catch (error) {
      console.error("Failed to delete booking:", error);
      alert("Failed to delete booking. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E40AF", // blue-800 color
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: "12px",
          maxWidth: "900px",
          width: "100%",
          boxShadow: "0 0 20px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "0.5rem" }}>My Bookings</h1>
        <h2 style={{ marginBottom: "1.5rem", fontWeight: "normal", color: "#555" }}>
          Welcome, {userName}
        </h2>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>You have no bookings.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                marginTop: "1rem",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#2563EB", color: "white" }}>
                  <th style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Date</th>
                  <th style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Time</th>
                  <th style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Guests</th>
                  <th style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Table</th>
                  <th style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Phone</th>
                  <th style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Booking ID</th>
                  <th style={{ padding: "0.75rem", border: "1px solid #ddd" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>{b.date}</td>
                    <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                      {b.fromTime} - {b.toTime}
                    </td>
                    <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>{b.guests}</td>
                    <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>{b.tableNumber}</td>
                    <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>{b.phone}</td>
                    <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>{b.bookingId}</td>
                    <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                      <button
                        onClick={() => handleDelete(b._id)}
                        disabled={deletingId === b._id}
                        style={{
                          backgroundColor: deletingId === b._id ? "#bbb" : "#e74c3c",
                          border: "none",
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          cursor: deletingId === b._id ? "not-allowed" : "pointer",
                          fontWeight: "600",
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        {deletingId === b._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
