// Import Dependencies
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// Import Routes
const busRoutes = require('./routes/busRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas Connection
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

connectToMongoDB();

// Register API routes
app.use('/api/buses', busRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong, please try again.' });
});

// Models
const Buses = mongoose.model("Buses", new mongoose.Schema({
  busNumber: String,
  route: [String],
  availableSeats: Number,
}));

const Admins = mongoose.model("Admins", new mongoose.Schema({
  username: String,
  password: String,
}));

const Users = mongoose.model("Users", new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  busId: mongoose.Schema.Types.ObjectId,
  stopId: String,
  ticketId: String,
}));

// Bus Routes
app.get("/buses", async (req, res) => {
  const buses = await Buses.find();
  res.json(buses);
});

app.post("/buses", async (req, res) => {
  const newBus = new Buses(req.body);
  await newBus.save();
  res.json(newBus);
});

app.put("/buses/:id", async (req, res) => {
  const updatedBus = await Buses.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedBus);
});

app.delete("/buses/:id", async (req, res) => {
  await Buses.findByIdAndDelete(req.params.id);
  res.json({ message: "Bus deleted successfully" });
});

// Admin Routes
app.get("/admins", async (req, res) => {
  const admins = await Admins.find();
  res.json(admins);
});

app.post("/admins", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newAdmin = new Admins({
    username,
    password: hashedPassword,
  });

  await newAdmin.save();
  res.json(newAdmin);
});

app.put("/admins/:id", async (req, res) => {
  const { username, password } = req.body;
  const updatedData = { username };

  if (password) {
    updatedData.password = await bcrypt.hash(password, 10);
  }

  const updatedAdmin = await Admins.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
  });
  res.json(updatedAdmin);
});

app.delete("/admins/:id", async (req, res) => {
  await Admins.findByIdAndDelete(req.params.id);
  res.json({ message: "Admin deleted successfully" });
});

// User Routes
app.get("/users", async (req, res) => {
  const users = await Users.find();
  res.json(users);
});



// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
