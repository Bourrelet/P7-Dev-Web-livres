const Book = require('../models/Book');
const fs = require('fs'); 
const path = require('path');
const sharp = require('sharp');


// Affiche tous les Book sur la page d'accueil.
exports.getBooks = async (req, res, next) => {
  
    try {
      console.log("lancement getBooks");
        const books = await Book.find();  
        res.status(200).json(books);  

        } catch (error) {
        next(error);
    }
};

// Affiche la page d'un Book en particulier.
exports.getBook = async (req, res, next) => {
  
    try {
      console.log("lancement getBook");
        const bookId = req.params.id; 
        const book = await Book.findById(bookId); 
    
        if (!book) {
          return res.status(404).json({ message: 'Livre non trouvé' }); 
        }
    
        res.status(200).json(book); 
      } catch (error) {
        next(error); 
      }
};

// Renvoit les 3 Book avec la meilleur note.
exports.getBestRatedBooks = async (req, res, next) => {
  
    try {
      console.log("lancement getBestRatedBooks");
      const bestBooks = await Book.find().sort({ averageRating: -1 }).limit(3);  
      res.status(200).json(bestBooks); 
    } catch (error) {
      next(error);  
    }
};

// Supprime le Book avec fs.
exports.deleteBook = async (req, res, next) => {
  
  try {
    console.log("lancement deleteBook");
    const bookId = req.params.id; 

    const book = await Book.findById(bookId); 
    
    if (!book) { 
      return res.status(404).send({ error: 'Livre non trouvé' }); 
    }

    console.log(book.userId, req.user.userId);
    if (book.userId != req.user.userId) { 
      return res.status(403).send({ error: '403: unauthorized request' });
    }
   
    await Book.findByIdAndDelete(bookId);


    const imagePath = path.join(__dirname, '../images/', book.imageUrl); 
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);  
    }

    res.status(200).send({ message: 'Livre et image supprimés avec succès' });
  } catch (error) {
    next(error); 
  }
};

// Attribue une note entre 1 et 5 au Book.
exports.rateBook = async (req, res, next) => {  
    try {
      console.log("lancement rateBook");

      // Definition des constantes
      const bookId = req.params.id; 
      const userId = req.body.userId; 
      const grade = req.body.rating; // rating dans la requete ; grade dans le modele.      
      const userRating = { userId, grade }; // Variable a push dans la propriete "ratings" du modele.
  
      // Verifications de logique metier avant push.
      if (grade < 0 || grade > 5) { // On s'assure que la note est OK.
        return res.status(400).json({ message: 'Rating must be between 0 and 5.' });
      }
     
      const book = await Book.findById(bookId);  // Essaye de recuperer le livre de la DB
      if (!book) { // Si "null" -> on retourne un msg d'erreur au front.
        return res.status(404).json({ message: 'Book not found.' });
      }
  
      // Vérifier si l'utilisateur a déjà évalué ce livre
      const alreadyRated = book.ratings.find((rate) => rate.userId === userId); // JS classique
      if (alreadyRated) { 
        return res.status(400).json({ message: 'User has already rated this book.' });
      }
         
      book.ratings.push(userRating);
      
  
      // Calcul et attribution de la moyenne.
      const totalRatings = book.ratings.length;
      const sumRatings = book.ratings.reduce((sum, rate) => sum + rate.grade, 0); 
      book.averageRating = sumRatings / totalRatings;
  
      // Sauvegarde des modifications dans la DB
      await book.save();
  
      res.status(200).json(book);
    } catch (error) {
      next(error); 
    }
  };
  
  // Ajout d'un livre dans la DB.
  exports.addBook = async (req, res, next) => {
    
    try {
      console.log("on lance le controlleur addbook");

      const bookData = JSON.parse(req.body.book); 
      const image = req.file; 
  
      if (!bookData || !image) { 
        return res.status(400).json({ message: 'Book details and image are required.' });
      }

      const imageName = `${Date.now()}.jpg`; 
      const imageUrl = `http://localhost:4000/images/${imageName}`; // URL relative
      const outputPath = path.join(__dirname, '../images', imageName); // URL absolue

      await sharp(image.buffer) 
        .resize({ width: 463, height: 595 })  
        .toFormat('jpeg')  
        .toFile(outputPath); 
      
      
      const newBook = new Book({
        title: bookData.title,
        author: bookData.author,
        userId: req.user.userId, // recuperation depuis la req, plutot que depuis bookData.
        imageUrl: imageUrl,
        year: bookData.year, 
        genre: bookData.genre, 
        averageRating: 0, // Initialise la note moyenne à 0
        ratings: [] // Initialise avec un tableau vide
      });

      await newBook.save();
  
      res.status(201).json({ message: 'Book successfully added!', book: newBook });
    } catch (error) {
      next(error); 
    }
  };

// Met a jour le livre ; Helpers -> updateFile & updateBody
exports.updateBook = async (req, res, next) => {
  try {
    console.log("lancement updateBook");
      const { id } = req.params;
      const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (book.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized request.' });
    }

  
    if (!req.file && !req.body) {
      return res.status(400).json({ message: 'No data provided for update.' });
    }

  
    await Promise.all([updateFile(book, req), updateBody(book, req)]); // helpers

   
    res.status(200).json({ message: 'Book successfully updated!' });
  } catch (error) {
    next(error);
  }
};


// HELPERS UPDATE FUNCTION
// HELPERS UPDATE FUNCTION


//Helper req.file ->
const updateFile = async (book, req) => {

  if (req.file) {

    if (!req.file.mimetype.startsWith('image/')) { 
      console.error('Invalid file type: Only image files are allowed.');
      throw new Error('Only image files are allowed!'); // Bubbling
    }

    try { 
      const oldImageName = book.imageUrl.split('/images/')[1]; 
      const oldImagePath = path.join(__dirname, '../images', oldImageName); 
      await fs.promises.unlink(oldImagePath); 
    } catch (err) {
      console.error('Failed to delete old image:', err);
      throw new Error('Failed to delete the old image, please try again.'); // Bubbling
    } 
    

    const image = req.file; 
    const imageName = `${Date.now()}.jpg`; 
    const imageUrl = `http://localhost:4000/images/${imageName}`; // URL relative ; 
    const outputPath = path.join(__dirname, '../images', imageName); // URL absolue ;

    await sharp(image.buffer) 
      .resize({ width: 463, height: 595 })  
      .toFormat('jpeg')  
      .toFile(outputPath); 

    
    return Book.findByIdAndUpdate(book._id, { imageUrl: imageUrl }, { new: true, runValidators: true });
  }
  return null;
};

// Helper req.body
const updateBody = async (book, req) => {
  if (req.body) { 
    return Book.findByIdAndUpdate(book._id, req.body, { new: true, runValidators: true }); 
  }
  return null;
};

// HELPERS UPDATE FUNCTION
// HELPERS UPDATE FUNCTION