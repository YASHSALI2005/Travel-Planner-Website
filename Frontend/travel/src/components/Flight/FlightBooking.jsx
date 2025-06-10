import React, { useState, useContext } from 'react';
import axios from 'axios'; // Import Axios for making requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext
import './flightbooking.css'; // Import your CSS file for styling
import flightImage1 from '../../assets/images/image24.webp'; // Import your flight images
import flightImage2 from '../../assets/images/image23.avif';
import flightImage3 from '../../assets/images/image25.webp';
import flightImage4 from '../../assets/images/imageaka.jpg';
import flightImage5 from '../../assets/images/flights5.jpg'; // Corrected flight image extension
import flightImage6 from '../../assets/images/flights6.jpg'; // Corrected flight image extension
import PaymentPopup from '../../Payment/PaymentPopup'; // Import the PaymentPopup component

const FlightBooking = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const navigate = useNavigate(); // Initialize navigate
  const { userEmail } = useContext(AuthContext); // Get userEmail from AuthContext

  const flights = [
    {
      id: 1,
      name: 'Air India',
      price: '₹5,000',
      from: 'Mumbai',
      to: 'Bengaluru',
      departure: '10:00 AM',
      arrival: '12:00 PM',  
      image: flightImage1,
    },
    {
      id: 2,
      name: 'Indigo',
      price: '₹6,500',
      from: 'Mumbai',
      to: 'Bengaluru',
      departure: '11:00 AM',
      arrival: '1:00 PM',
      image: flightImage2,
    },
    {
      id: 3,
      name: 'Spirit',
      price: '₹7,000',
      from: 'Mumbai',
      to: 'Bengaluru',
      departure: '2:00 PM',
      arrival: '3:00 PM',
      image: flightImage3,
    },
    {
      id: 4,
      name: 'Akasa Air',
      price: '₹5,000',
      from: 'Mumbai',
      to: 'Bengaluru',
      departure: '2:00 PM',
      arrival: '3:00 PM',
      image: flightImage4,
    },
    {
      id: 5,
      name: 'Vistara',
      price: '₹8,000',
      from: 'Delhi',
      to: 'Mumbai',
      departure: '9:00 AM',
      arrival: '11:00 AM',
      image: flightImage5,
    },
    {
      id: 6,
      name: 'SpiceJet',
      price: '₹4,500',
      from: 'Chennai',
      to: 'Hyderabad',
      departure: '4:00 PM',
      arrival: '5:30 PM',
      image: flightImage6,
    }
  ];

  // Function to handle booking confirmation
  const handleBooking = async () => {
    if (!selectedFlight) return; // Prevent booking if no flight is selected

    // Show payment popup instead of directly confirming the booking
    setShowPaymentPopup(true);
  };

  // Function to handle payment and store data in MongoDB
  const handlePayNow = async () => {
    if (!selectedFlight) return; // Prevent booking if no flight is selected

    const bookingDetails = {
      flightName: selectedFlight.name,
      price: selectedFlight.price,
      from: selectedFlight.from,
      to: selectedFlight.to,
      departure: selectedFlight.departure,
      arrival: selectedFlight.arrival,
      userEmail: userEmail, // Use the dynamic user email from context
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/book-flight`, bookingDetails); // Using Axios for the POST request

      if (response.status === 200) {
        console.log('Flight booking successful:', response.data);
        setShowPaymentPopup(false); // Close the payment popup after successful booking
        navigate('/booking-confirmation', { state: bookingDetails }); // Redirect with booking details
      }
    } catch (error) {
      console.error('Error booking flight:', error);
      alert('Failed to book flight');
    }
  };

  return (
    <div>
      <main>
        <section className="flight-section">
          <h2 className="section-title">Available Flights</h2>
          <div className="flight-cards">
            {flights.map((flight) => (
              <div className="flight-card" key={flight.id}>
                <img src={flight.image} alt={flight.name} />
                <div className="flight-info">
                  <h3>{flight.name}</h3>
                  <p className="price">{flight.price}</p>
                  <p><strong>From:</strong> {flight.from}</p>
                  <p><strong>To:</strong> {flight.to}</p>
                  <p><strong>Departure:</strong> {flight.departure}</p>
                  <p><strong>Arrival:</strong> {flight.arrival}</p>
                  <div className="buttons">
                    <button className="book-now" onClick={() => setSelectedFlight(flight)}>Book Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Display confirmation section when a flight is selected */}
          {selectedFlight && (
            <div className="confirmation">
              <h3>You have selected: {selectedFlight.name}</h3>
              <button className="confirm-booking" onClick={handleBooking}>Confirm Booking</button>
            </div>
          )}

          {/* Display the payment popup */}
          {showPaymentPopup && <PaymentPopup onPayNow={handlePayNow} />}
        </section>
      </main>
      <footer>
        {/* Add footer content here */}
      </footer>
    </div>
  );
};

export default FlightBooking;
