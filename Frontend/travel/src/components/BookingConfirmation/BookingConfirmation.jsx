import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
import './BookingConfirmation.css'; // We'll create this CSS file next

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state; // Get booking details from state

  const handleGoHome = () => {
    navigate('/');
  };

  if (!bookingDetails) {
    return (
      <div className="booking-confirmation-container">
        <h2>No Booking Details Found</h2>
        <p>Please return to the booking page to make a new reservation.</p>
        <button onClick={handleGoHome}>Back to Home</button>
      </div>
    );
  }

  // Determine if it's a room or flight booking
  const isRoomBooking = bookingDetails.roomType !== undefined;
  const isFlightBooking = bookingDetails.flightName !== undefined;

  return (
    <div className="booking-confirmation-container">
      <h2>Booking Confirmed!</h2>
      <p>Thank you for your booking. Here are your details:</p>
      <div className="booking-details">
        {isRoomBooking && (
          <>
            <h3>Room Booking Details</h3>
            <p><strong>Room Type:</strong> {bookingDetails.roomType}</p>
            <p><strong>Price:</strong> {bookingDetails.price}</p>
            <p><strong>Facilities:</strong> {bookingDetails.facilities}</p>
          </>
        )}

        {isFlightBooking && (
          <>
            <h3>Flight Booking Details</h3>
            <p><strong>Flight Name:</strong> {bookingDetails.flightName}</p>
            <p><strong>Price:</strong> {bookingDetails.price}</p>
            <p><strong>From:</strong> {bookingDetails.from}</p>
            <p><strong>To:</strong> {bookingDetails.to}</p>
            <p><strong>Departure:</strong> {bookingDetails.departure}</p>
            <p><strong>Arrival:</strong> {bookingDetails.arrival}</p>
          </>
        )}
        <p><strong>User Email:</strong> {bookingDetails.userEmail || 'N/A'}</p>
      </div>
      <button onClick={handleGoHome}>Back to Home</button>
    </div>
  );
};

export default BookingConfirmation; 