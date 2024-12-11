const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  availableSeats: { type: Number, required: true, min: 0 }, // Number of available seats
  route: { type: [String], required: true }, // Array of stops the bus will cover
}, { timestamps: true });

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
