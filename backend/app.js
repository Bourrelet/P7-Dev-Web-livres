const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

const errorHandler = require('./middleware/errorHandler'); 



app.use(express.json()); // traitement auto des body req en json
app.use(cors()); // configuration automatique des CORS

app.use('/images', express.static(path.join(__dirname, 'images'))); // -> Acces au dossier image pour express.




const testFilePath = path.join(__dirname, 'images', '1729257852809.jpg');

fs.access(testFilePath, fs.constants.R_OK, (err) => { // middleware verification chemin relatif
  if (err) {
    console.log('Pas d\'accès en lecture au fichier:', err);
  } else {
    console.log('Accès en lecture au fichier OK');
  }
});

app.use((req, res, next) => { // middleware de log des requetes.
  console.log(`Request URL: ${req.url}`);
  next();
});



app.use('/api/auth', authRoutes); 
app.use('/api/books', bookRoutes);

app.use(errorHandler);



 
  
  

module.exports = app;