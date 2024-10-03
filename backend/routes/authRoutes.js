const express = require('express');
const router = express.Router(); // Crée une nouvelle instance de Router
const authController = require('../controllers/authController');


router.post('/signup', userController.signupUser);
router.post('/login', userController.loginUser);


module.exports = router; // Exporte le routeur pour l'utiliser dans app.js