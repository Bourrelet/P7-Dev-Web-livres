const express = require('express');

const app = express();

mongoose.connect('mongodb+srv://AnyVegetable:Radis@evap6ocr.xqhjd.mongodb.net/?retryWrites=true&w=majority&appName=EvaP6ocr',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



const mongoose = require('mongoose');




app.use(express.json()); // permet de traiter les req en json

app.use((req, res, next) => { // configuration des CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.post('/api/auth/signup',(req, res, next) => {
    // SIGN UP
    next();
  });
  app.post('/api/auth/login',(req, res, next) => {
    // SIGN IN
    next();
  });

  app.post('/api/books/:id',(req, res, next) => {
    // update book
    next();
  });

  app.post('/api/books',(req, res, next) => {
    // add new book
    next();
  });

  app.put('/api/books/:id',(req, res, next) => {
    // update book
    next();
  });

  app.delete('/api/books/:id',(req, res, next) => {
    // delete book
    next();
  });

  app.post('/api/books/:id/rating',(req, res, next) => {
    // rating
    next();
  });

  app.get('/api/books',(req, res, next) => {
    // gallerie
    next();
  });

  app.get('/api/books/:id',(req, res, next) => {
    // Recupere 1 livre en particulier
    next();
  });

  app.get('/api/books/bestrating',(req, res, next) => {
    // gallerie best books
    next();
  });
  
  

module.exports = app;