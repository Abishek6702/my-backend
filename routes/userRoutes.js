const express = require('express');
const User = require('../models/User');
const Bus = require('../models/Bus'); // To update bus seat count
const router = express.Router();

// Book ticket
router.post('/book-ticket', async (req, res) => {
  const { name, mobile, email, busId, stopId } = req.body;

  // Check if any required field is missing
  if (!name || !mobile || !email || !busId || !stopId) {
    return res.status(400).json({ error: 'Missing required fields: name, mobile, email, busId, stopId' });
  }

  try {
    // Find the bus and check for available seats
    const bus = await Bus.findById(busId);
    if (!bus || bus.availableSeats <= 0) {
      return res.status(400).json({ error: 'No available seats for the selected bus' });
    }

    // Create a new user with the provided details
    const user = new User({
      name,
      mobile,
      email,
      busId,
      stopId,
      ticketId: `TICKET-${Date.now()}`
    });

    // Save the user to the database
    await user.save();

    // Update available seats in the bus
    bus.availableSeats -= 1;
    await bus.save();

    // Send back the ticket ID, bus number, and stop name
    res.status(200).json({
      ticketId: user.ticketId,
      busNumber: bus.busNumber,
      stopName: stopId // Assuming stopId is the name, adjust if necessary
    });
  } catch (err) {
    console.error('Error saving user:', err); // Log the detailed error for debugging
    res.status(500).json({ error: 'Failed to save user details. Please try again.' });
  }
});

// Cancel ticket
router.post('/cancel-ticket', async (req, res) => {
  const { ticketId } = req.body;

  // Check if ticketId is provided
  if (!ticketId) {
    return res.status(400).json({ error: 'Ticket ID is required' });
  }

  try {
    // Find the user by ticket ID
    const user = await User.findOne({ ticketId });
    if (!user) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Find the bus related to this user and update available seats
    const bus = await Bus.findById(user.busId);
    if (bus) {
      bus.availableSeats += 1;
      await bus.save();
      
    }

    // Remove the user booking from the database
    await User.deleteOne({ ticketId });

    res.status(200).json({ message: 'Ticket cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling ticket:', err);
    res.status(500).json({ error: 'Failed to cancel the ticket. Please try again.' });
  }
});

module.exports = router;
