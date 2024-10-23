require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000, 
  jwtSecret: process.env.JWT_SECRET, 
  db: {
    uri: process.env.MONGODB_URI
  },
};
