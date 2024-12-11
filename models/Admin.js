const mongoose = require('mongoose');

// Admin schema for storing login details
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Create and export Admin model
module.exports = mongoose.model('Admin', adminSchema);
