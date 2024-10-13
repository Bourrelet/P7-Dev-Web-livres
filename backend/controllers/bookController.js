const Book = require('../models/Book');

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

};

exports.rateBook = async (req, res) => {

};

exports.addBook = async (req, res) => {

};

exports.updateBook = async (req, res) => {

};

