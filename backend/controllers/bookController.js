const Book = require('../models/Book');
const fs = require('fs');  // Pour supprimer le fichier image du disque
const path = require('path');
const authMiddleware = require('../middleware/auth');  // Middleware d'authentification

exports.getBooks = async (req, res, next) => {

    try {
        const books = await Book.find();  // Récupérer tous les livres de la base de données
        res.status(200).json(books);  // Renvoie un tableau JSON avec tous les livres
        }   catch (error) {
        next(error);  // Passe l'erreur au middleware de gestion d'erreurs
    }
};

exports.getBook = async (req, res) => {
    try {
        const bookId = req.params.id;  // Récupère le parametre dynamique de l'url de la requete.
        const book = await Book.findById(bookId);  // Cherche le livre correspondant a l'id
    
        if (!book) {
          return res.status(404).json({ message: 'Livre non trouvé' });  // Si aucun livre n'est trouvé
        }
    
        res.status(200).json(book);  // Si le livre est trouvé, le renvoyer en réponse
      } catch (error) {
        next(error);  // Envoie l'erreur au middleware de gestion des erreurs
      }
};

exports.getBestRatedBooks = async (req, res, next) => {
    try {
      const bestBooks = await Book.find().sort({ averageRating: -1 }).limit(3);  // .sort() & .limit() -> methodes magiques Mongoose.
      res.status(200).json(bestBooks);  // Renvoie les 3 livres avec la meilleure note
    } catch (error) {
      next(error);  // Envoie l'erreur au middleware de gestion d'erreurs
    }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id; // On  recupere l'ID du livre grace au paranetre dynamique

    const book = await Book.findById(bookId); // Methode mongoose pour trouver le livre par correspondance.
    if (!book) { // En fait si mongoose ne trouve pas, il renvoit 'null' mais ne genere pas d'erreur -> Need une business error.
      return res.status(404).send({ error: 'Livre non trouvé' }); // Sinon on pourrait throw new Error pour laisser le catch gerer ca avec le MW.
    }

    // Vérifier si l'utilisateur authentifié est bien celui qui a créé le livre
    if (book.userId != req.user.userId) {
      return res.status(403).send({ error: '403: unauthorized request' });
    }

    await Book.findByIdAndDelete(bookId);

    // Supprimer l'image associée si elle existe
    const imagePath = path.join(__dirname, '../uploads/', book.image); // ?? C'est quoi l'URL complete finalement? book.image c'est le fichier ... c'est un string .. donmc une url ?
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);  // Supprimer l'image
    }

    res.status(200).send({ message: 'Livre et image supprimés avec succès' });
  } catch (error) {
    next(error); // Passer l'erreur au middleware de gestion d'erreurs
  }
};

exports.rateBook = async (req, res) => {

};

exports.addBook = async (req, res, next) => {
  try {
    // Extract the fields from the request
    const bookData = JSON.parse(req.body.book); // express.json() ne fonctionne que pour le format application/json. Ici on a un FormData ; donc on doit utiliser JSON.parse (a l'ancienne).
    const image = req.file; // Multer analyse la requete et extrait le fichier dans un objet image

    // If no file or book information, send an error
    if (!bookData || !image) { // si l'un  des 2 est null ou undefined. erreur metier.
      return res.status(400).json({ message: 'Book details and image are required.' });
    }

    // Create a new book instance
    const newBook = new Book({
      title: bookData.title,
      author: bookData.author,
      userId: req.user.userId, // directement l'id de l'humain plutot que celui de la requete ...
      imageUrl: image.path, // Using `imageUrl` to match the schema definition
      year: bookData.year, // Année de publication du livre
      genre: bookData.genre, // Genre du livre
      averageRating: 0, // Initialiser la note moyenne à 0
      ratings: [] // Initialiser avec un tableau vide
    });

    // Save the book to the database avec un _id gratuit pas cher.
    await newBook.save();

    // Respond with success message
    res.status(201).json({ message: 'Book successfully added!', book: newBook });
  } catch (error) {
    next(error); // Pass any error to the error-handling middleware
  }
};

exports.updateBook = async (req, res) => {

};

