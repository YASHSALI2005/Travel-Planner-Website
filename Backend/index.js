require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Models
const SignupModel = require("./models/signup");
const RoomModel = require("./models/room");
const FlightModel = require("./models/flights");

// Middleware
app.use(express.json());

app.use(cors({
  origin: ["https://travel-planner-websitefrontend.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());


// Handle preflight OPTIONS requests for all routes
app.options('*', cors());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "Travel Planner API is running",
    endpoints: [
      "/signup - Register a new user",
      "/login - User authentication",
      "/bookroom - Book a room",
      "/book-flight - Book a flight"
    ]
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Signup Route
app.post('/api/signup', (req, res) => {
  SignupModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", req.body);

  SignupModel.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "No record found" });
      }
      if (user.password !== password) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      return res.json({ message: "success" });
    })
    .catch(err => {
      console.error("Login error:", err);
      res.status(500).json({ error: err.message });
    });
});

// Room Booking Route
app.post('/api/bookroom', (req, res) => {
  const { roomType, price, facilities, userEmail } = req.body;

  RoomModel.create({ roomType, price, facilities, userEmail })
    .then(room => res.json({ message: "Room booked successfully", room }))
    .catch(err => {
      console.error("Error while booking room:", err);
      res.status(500).json({ error: err.message });
    });
});

// Flight Booking Route
app.post('/api/book-flight', (req, res) => {
  const { flightName, price, departure, arrival, date, userEmail } = req.body;

  FlightModel.create({ flightName, price, departure, arrival, date, userEmail })
    .then(flight => res.json({ message: "Flight booked successfully", flight }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Get Room Bookings by User Email
app.get('/my-room-bookings/:userEmail', (req, res) => {
  const { userEmail } = req.params;
  RoomModel.find({ userEmail })
    .then(bookings => res.json(bookings))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Get Flight Bookings by User Email
app.get('/my-flight-bookings/:userEmail', (req, res) => {
  const { userEmail } = req.params;
  FlightModel.find({ userEmail })
    .then(bookings => res.json(bookings))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Cancel Room Booking
app.delete('/cancel-room-booking/:id', (req, res) => {
  const { id } = req.params;
  RoomModel.findByIdAndDelete(id)
    .then(result => {
      if (!result) {
        return res.status(404).json({ message: "Room booking not found" });
      }
      res.json({ message: "Room booking cancelled successfully", result });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Cancel Flight Booking
app.delete('/cancel-flight-booking/:id', (req, res) => {
  const { id } = req.params;
  FlightModel.findByIdAndDelete(id)
    .then(result => {
      if (!result) {
        return res.status(404).json({ message: "Flight booking not found" });
      }
      res.json({ message: "Flight booking cancelled successfully", result });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Optional: Serve static files from frontend if needed (commented out)
// app.use(express.static(path.join(__dirname, "../Frontend/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
// });

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
