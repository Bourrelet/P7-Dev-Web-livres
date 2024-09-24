const express = require('express');

const app = express();

app.use((req, res) => {res.json({message: 'requete grand succes'})});

module.exports = app;