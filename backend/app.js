const express = require('express');
const app = express();
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');



app.use(express.json()); // traitement auto des body req en json
app.use(cors()); // configuration automatique des CORS

app.use('/uploads', express.static('images')); // ???

app.use('/api/auth', authRoutes); 
app.use('/api/books', bookRoutes);



 
  
  

module.exports = app;