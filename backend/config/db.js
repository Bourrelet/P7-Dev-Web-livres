const config = require('./config');
const mongoose = require('mongoose');



const connectMongoose = async () => {
  try {
    await mongoose.connect(config.db.uri);
    console.log('Connected to MongoDB with Mongoose!');
  } catch (err) {
    console.error('Error connecting to MongoDB with Mongoose:', err.message);
    process.exit(1);
  }
};

module.exports = connectMongoose;
