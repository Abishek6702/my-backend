const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin'); // Adjust path as needed

mongoose.connect('mongodb://localhost:27017/bus-booking', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('admin', 10);
    await Admin.create({ username: 'aravinth', password: hashedPassword });
    
    console.log('Admin user seeded successfully');
    process.exit();
  })
  .catch(err => console.error('Database connection error:', err));
