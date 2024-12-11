// server/models/Ticket.js

const mongoose = require('mongoose');

// Ticket schema definition
const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  busNumber: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  // Add other fields if needed
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
