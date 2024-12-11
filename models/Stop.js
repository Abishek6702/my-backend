// server/models/Stop.js

const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String, // Optional: to store the location of the stop (city, area, etc.)
  },
  buses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',  // Assuming you want to reference buses that pass through this stop
    }
  ]
});

const Stop = mongoose.model('Stop', stopSchema);

module.exports = Stop;
