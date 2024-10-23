const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

const errorHandler = require('./middleware/errorHandler'); 



app.use(express.json()); 
app.use(cors()); 

app.use('/images', express.static(path.join(__dirname, 'images'))); // -> URL relative


// app.use((req, res, next) => { // middleware de log des requetes.
//   console.log(`Request URL: ${req.url}`);
//   console.log(`Request body: ${req.body}`);
//   next();
// });



app.use('/api/auth', authRoutes); 
app.use('/api/books', bookRoutes);

app.use(errorHandler);



 
  
  

module.exports = app;