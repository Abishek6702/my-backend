const express = require('express');
const Bus = require('../models/Bus');
const router = express.Router();

// Fetch buses by stopping point
router.get('/:stop', async (req, res) => {
  try {
    const buses = await Bus.find({ route: req.params.stop });
    res.json(buses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update seat availability after booking
router.post('/book', async (req, res) => {
  try {
    const bus = await Bus.findById(req.body.busId);
    if (bus.availableSeats > 0) {
      bus.availableSeats -= 1;
      await bus.save();
      res.json({ message: 'Booking successful' });
    } else {
      res.status(400).json({ error: 'No available seats' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel ticket and update seat count
router.post('/cancel', async (req, res) => {
  try {
    const bus = await Bus.findById(req.body.busId);
    bus.availableSeats += 1;
    await bus.save();
    res.json({ message: 'Ticket canceled successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
