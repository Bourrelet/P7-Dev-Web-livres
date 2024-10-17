const express = require('express');
const router = express.Router(); // Crée une nouvelle instance de Router
const upload = require('../middleware/upload');
const bookController = require('../controllers/bookController');


router.get('/', bookController.getBooks);
    // gallerie

router.get('/:id', bookController.getBook);
    // Recupere 1 livre en particulier
    
router.get('/bestrating', bookController.getBestRatedBooks);
    // gallerie best books

router.delete('/:id', authMiddleware, bookController.deleteBook);
    // delete book

router.post('/:id/rating', authMiddleware, bookController.rateBook);
    // rating by user.

router.post('/:id', authMiddleware, upload.single('image'), bookController.addBook); 
    // add book

router.put('/:id', authMiddleware, upload.single('image'), bookController.updateBook);
    // update book


module.exports = router; // Exporte le routeur pour l'utiliser dans router.js