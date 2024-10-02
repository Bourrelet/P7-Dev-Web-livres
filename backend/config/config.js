require('dotenv').config();  // Charger les variables d'environnement depuis .env

module.exports = {
  port: process.env.PORT || 4000,  // Port du serveur
  jwtSecret: process.env.JWT_SECRET,  // Secret JWT pour l'authentification
  db: {
    uri: process.env.MONGODB_URI
  },
};
