import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import './MyBookings.css'; // We'll create this CSS file next

const MyBookings = () => {
  const [roomBookings, setRoomBookings] = useState([]);
  const [flightBookings, setFlightBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, userEmail } = useContext(AuthContext); // Get userEmail from AuthContext

  console.log('MyBookings - isAuthenticated:', isAuthenticated); // Debugging
  console.log('MyBookings - userEmail:', userEmail); // Debugging

  // Remove hardcoded userEmail
  // const userEmail = "ommkar@gmail.com"; // Replaced with dynamic user email from context or API

  const fetchBookings = async () => {
    if (!userEmail) {
      console.log('Not authenticated or userEmail not available, skipping fetch.'); // Debugging
      setLoading(false);
      return;
    }
    try {
      // Fetch room bookings
      console.log(`Fetching room bookings for user: ${userEmail}`); // Debugging
      const roomResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/my-room-bookings/${userEmail}`);
      console.log('Room bookings response:', roomResponse.data); // Debugging
      setRoomBookings(roomResponse.data);

      // Fetch flight bookings
      console.log(`Fetching flight bookings for user: ${userEmail}`); // Debugging
      const flightResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/my-flight-bookings/${userEmail}`);
      console.log('Flight bookings response:', flightResponse.data); // Debugging
      setFlightBookings(flightResponse.data);

      setLoading(false); // Set loading to false after successful fetch

    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings. Please try again later.');
      setLoading(false); // Set loading to false even on error
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !userEmail) {
      console.log('Not authenticated or userEmail not available, skipping fetch.'); // Debugging
      setLoading(false);
      return;
    }
    fetchBookings();
  }, [isAuthenticated, userEmail]);

  const handleCancelBooking = async (id, type) => {
    if (!window.confirm(`Are you sure you want to cancel this ${type} booking?`)) {
      return;
    }
    try {
      const endpoint = type === 'room' ? `${import.meta.env.VITE_BACKEND_URL}/api/cancel-room-booking/${id}` : `${import.meta.env.VITE_BACKEND_URL}/api/cancel-flight-booking/${id}`;
      await axios.delete(endpoint);
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} booking cancelled successfully!`);
      fetchBookings(); // Re-fetch bookings to update the list
    } catch (err) {
      console.error(`Error cancelling ${type} booking:`, err);
      alert(`Failed to cancel ${type} booking.`);
    }
  };

  if (loading) {
    return <div className="my-bookings-container">Loading bookings...</div>;
  }

  if (error) {
    return <div className="my-bookings-container" style={{ color: 'red' }}>{error}</div>;
  }

  if (!isAuthenticated) {
    return <div className="my-bookings-container"><p>Please log in to view your bookings.</p></div>;
  }

  return (
    <div className="my-bookings-container">
      <h2>My Bookings</h2>

      {roomBookings.length === 0 && flightBookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="booking-list">
          {roomBookings.length > 0 && (
            <div className="booking-section">
              <h3>Room Bookings</h3>
              {roomBookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <p><strong>Room Type:</strong> {booking.roomType}</p>
                  <p><strong>Price:</strong> {booking.price}</p>
                  <p><strong>Facilities:</strong> {booking.facilities}</p>
                  <p><strong>Booked by:</strong> {booking.userEmail}</p>
                  <button 
                    className="cancel-button"
                    onClick={() => handleCancelBooking(booking._id, 'room')}
                  >Cancel Booking</button>
                </div>
              ))}
            </div>
          )}

          {flightBookings.length > 0 && (
            <div className="booking-section">
              <h3>Flight Bookings</h3>
              {flightBookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <p><strong>Flight Name:</strong> {booking.flightName}</p>
                  <p><strong>Price:</strong> {booking.price}</p>
                  <p><strong>From:</strong> {booking.from}</p>
                  <p><strong>To:</strong> {booking.to}</p>
                  <p><strong>Departure:</strong> {booking.departure}</p>
                  <p><strong>Arrival:</strong> {booking.arrival}</p>
                  <p><strong>Booked by:</strong> {booking.userEmail}</p>
                  <button 
                    className="cancel-button"
                    onClick={() => handleCancelBooking(booking._id, 'flight')}
                  >Cancel Booking</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings; 