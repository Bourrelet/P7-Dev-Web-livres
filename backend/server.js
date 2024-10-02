const app = require('./app');
const connectMongoose = require('./db'); // Connexion via db.js
const config = require('./config');

connectMongoose(); // Lancer la connexion à MongoDB


// 3. Démarrer le serveur
app.listen(config.port, () => {
    console.log(`Serveur démarré sur http://localhost:${config.port}`);
  });