const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin'); // Admin model for login validation
const Bus = require('../models/Bus'); // Bus model to get bus details
const Ticket = require('../models/Ticket'); 
//const Ticket = require('../models/User');// Ticket model for fetching ticket bookings
const router = express.Router();

// Admin login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Login successful, send back the admin info (optional)
    res.status(200).json({ message: 'Login successful', adminId: admin._id });
  } catch (err) {
    console.error('Error during admin login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all admins (for display/editing purposes)
router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find(); // Fetch all admin users
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admins' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users from the database
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get all buses (for display/editing purposes)
router.get('/buses', async (req, res) => {
  try {
    const buses = await Bus.find(); // Fetch all buses
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bus details' });
  }
});

// Get all ticket bookings (for display/editing purposes)
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Ticket.find(); // Fetch all ticket bookings
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ticket bookings' });
  }
});

// Add a new bus (for admin)
router.post('/buses', async (req, res) => {
  const { busNumber, availableSeats } = req.body;

  if (!busNumber || !availableSeats) {
    return res.status(400).json({ error: 'Bus number and available seats are required' });
  }

  try {
    const bus = new Bus({
      busNumber,
      availableSeats
    });

    await bus.save();
    res.status(201).json({ message: 'Bus added successfully', bus });
  } catch (err) {
    res.status(500).json({ error: 'Error adding new bus' });
  }
});

// Edit a bus's details (for admin)
router.put('/buses/:id', async (req, res) => {
  const { busNumber, availableSeats } = req.body;
  
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { busNumber, availableSeats },
      { new: true } // Return updated bus object
    );
    
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.status(200).json({ message: 'Bus updated successfully', bus });
  } catch (err) {
    res.status(500).json({ error: 'Error updating bus details' });
  }
});

// Delete a bus (for admin)
router.delete('/buses/:id', async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    
    res.status(200).json({ message: 'Bus deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting bus' });
  }
});

// Delete a booking (for admin)
router.delete('/bookings/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket booking not found' });
    }
    
    // Update the available seats in the corresponding bus
    const bus = await Bus.findById(ticket.busId);
    if (bus) {
      bus.availableSeats += 1;
      await bus.save();
    }

    res.status(200).json({ message: 'Ticket cancelled and bus seat updated' });
  } catch (err) {
    res.status(500).json({ error: 'Error cancelling booking' });
  }
});

module.exports = router;
