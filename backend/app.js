const express = require('express');

const app = express();

// MONGODB
// MONGODB
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://AnyVegetable:Crochet@evap6ocr.xqhjd.mongodb.net/?retryWrites=true&w=majority&appName=EvaP6ocr";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
// MONGODB
// MONGODB


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
  // app.post('/api/auth/login',(req, res, next) => {
  //   // SIGN IN
  //   next();
  // });

  // app.post('/api/books/:id',(req, res, next) => {
  //   // update book
  //   next();
  // });

  // app.post('/api/books',(req, res, next) => {
  //   // add new book
  //   next();
  // });

  // app.put('/api/books/:id',(req, res, next) => {
  //   // update book
  //   next();
  // });

  // app.delete('/api/books/:id',(req, res, next) => {
  //   // delete book
  //   next();
  // });

  // app.post('/api/books/:id/rating',(req, res, next) => {
  //   // rating
  //   next();
  // });

  // app.get('/api/books',(req, res, next) => {
  //   // gallerie
  //   next();
  // });

  // app.get('/api/books/:id',(req, res, next) => {
  //   // Recupere 1 livre en particulier
  //   next();
  // });

  // app.get('/api/books/bestrating',(req, res, next) => {
  //   // gallerie best books
  //   next();
  // });
  
  

module.exports = app;