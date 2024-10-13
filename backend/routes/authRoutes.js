const express = require('express');
const router = express.Router(); // Crée une nouvelle instance de Router
const authController = require('../controllers/authController');


router.post('/signup', authController.signupUser);
router.post('/login', authController.loginUser);


module.exports = router; // Exporte le routeur pour l'utiliser dans app.js