require('dotenv').config(); //charge .env dans process.env
const mongoose = require('mongoose');



const connectMongoose = async () => {
  try {
    await mongoose.connect(config.db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB with Mongoose!');
  } catch (err) {
    console.error('Error connecting to MongoDB with Mongoose:', err.message);
    process.exit(1);
  }
};

module.exports = connectMongoose;
