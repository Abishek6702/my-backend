const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  stopId: { type: String, required: true },  // Adjust the type if needed
  ticketId: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
