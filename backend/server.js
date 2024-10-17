const app = require('./app');
const config = require('./config/config');
const connectMongoose = require('./config/db'); // Connexion via db.js


connectMongoose(); // Lancer la connexion à MongoDB


// 3. Démarrer le serveur
app.listen(config.port, () => {
    console.log(`Serveur démarré sur http://localhost:${config.port}`);
  });


console.log('JWT Secret depuis config:', config.jwtSecret);
