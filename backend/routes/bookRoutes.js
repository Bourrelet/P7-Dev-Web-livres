const express = require('express');
const router = express.Router(); // Crée une nouvelle instance de Router
const bookController = require('../controllers/bookController');


router.get('/', bookController.getBooks);
    // gallerie

router.get('/:id', bookController.getBook);
    // Recupere 1 livre en particulier
    
router.get('/bestrating', bookController.getBestRatedBooks);
    // gallerie best books

router.delete('/:id', bookController.deleteBook);
    // delete book

router.post('/:id/rating', bookController.rateBook);
    // rating by user.

router.post('/:id', bookController.addBook); 
    // add book

router.put('/:id', bookController.updateBook);
    // update book


module.exports = router; // Exporte le routeur pour l'utiliser dans router.js