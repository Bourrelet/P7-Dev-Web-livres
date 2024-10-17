const express = require('express');
const app = express();
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

const errorHandler = require('./middleware/errorHandler'); 



app.use(express.json()); // traitement auto des body req en json
app.use(cors()); // configuration automatique des CORS

app.use('/images', express.static('images')); // -> Acces au dossier image pour express.

app.use('/api/auth', authRoutes); 
app.use('/api/books', bookRoutes);

app.use(errorHandler);



 
  
  

module.exports = app;