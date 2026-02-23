const mongoose = require('mongoose');
require('dotenv').config();
const Watch = require('../models/Watch');
const path = require('path');
const fs = require('fs');

// Load watch data from the generated JSON file
const watchDataPath = path.join(__dirname, '../../Frontend/src/utils/watchData.json');
const watchData = JSON.parse(fs.readFileSync(watchDataPath, 'utf8'));

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/watches-ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing watches
    await Watch.deleteMany({});
    console.log('Cleared existing watches');

    // Insert watch data
    await Watch.insertMany(watchData);
    console.log(`Seeded ${watchData.length} watches`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();