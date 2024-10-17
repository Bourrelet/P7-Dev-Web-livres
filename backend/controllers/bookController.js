const Book = require('../models/Book');
const fs = require('fs');  // Pour supprimer le fichier image du disque
const path = require('path');
const sharp = require('sharp');

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


exports.rateBook = async (req, res, next) => {

  // Probleme de coherence entre req.body et le modele
  // req.body = { userId: String, rating: Number }
  // ratings: [
  //     {
  //       userId: { type: String, required: true },
  //       grade: { type: Number, required: true, min: 0, max: 5 }
  //     }
  // Probleme de coherence entre req.body et le modele
    
    
    try {
      //extraction variables
      
      const bookId = req.params.id; // On recupere l'id du book grace au parametre dynamique
      const userId = req.body.userId; // extrait le userId de req.body
      const grade = req.body.rating; // extrait rating de req.body et on le renomme correctement.
      
      // On pushera cet Objet dans la propriete-Array "ratings" de book -> conformement au modele
      const userRating = { userId, grade }; 
  
      // Verification logique metier.
  
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
      
      // Verifications de logique metier terminees -> 
      
      book.ratings.push(userRating); // On push notre objet conformement au modele
      
  
      // Calculer la nouvelle note moyenne
      const totalRatings = book.ratings.length;
      const sumRatings = book.ratings.reduce((sum, rate) => sum + rate.grade, 0); // JS classique
      book.averageRating = sumRatings / totalRatings;
  
      // Sauvegarder les modifications dans la base de données
      await book.save();
  
      // Répondre avec le livre mis à jour
      res.status(200).json(book);
    } catch (error) {
      next(error); // Passer l'erreur au middleware de gestion des erreurs
    }
  };
  

  exports.addBook = async (req, res, next) => {
    try {
      // Extract the fields from the request
      const bookData = JSON.parse(req.body.book); // express.json() ne fonctionne que pour le format application/json. Ici on a un FormData ; donc on doit utiliser JSON.parse (a l'ancienne).
      const image = req.file; // Multer analyse la requete et extrait le fichier dans un objet image
  
      // If no file or book information, send an error
      if (!bookData || !image) { // si l'un des 2 est null ou undefined. erreur metier.
        return res.status(400).json({ message: 'Book details and image are required.' });
      }
  
      // Save the image using Sharp
      const imageName = `${Date.now()}.jpeg`;
      const outputPath = path.join(__dirname, '../images', imageName); // chemin lcal -> URL disque
  
      await sharp(image.buffer)  // Recuperation du fichier dans la RAM
        .resize({ width: 470, height: 600 })  // Redimensionne l'image
        .toFormat('jpeg')  // Convertit au format jpeg
        .toFile(outputPath);  // Sauvegarde sur le disque dans le dossier images/
  
      // Create a new book instance
      const newBook = new Book({
        title: bookData.title,
        author: bookData.author,
        userId: req.user.userId, // directement l'id de l'humain plutot que celui de la requete ...
        imageUrl: '/images/' + imageName, // Utiliser le nom de l'image pour créer un chemin accessible via le serveur
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


exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract book ID from request params

        // Find the book by ID
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    // Check if the authenticated user is the creator of the book
    if (book.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized request.' });
    }

    // If neither body nor file is provided, return an error
    if (!req.file && !req.body) {
      return res.status(400).json({ message: 'No data provided for update.' });
    }

    // Execute file and body updates concurrently
    await Promise.all([updateFile(book, req), updateBody(book, req)]); // pas besoin de stocker les resultats des promesses.

    // Respond with success message
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
    if (!req.file.mimetype.startsWith('image/')) { // verifie que c bien une image grace au mimetype
      console.error('Invalid file type: Only image files are allowed.');
      throw new Error('Only image files are allowed!'); // On balance l'erreur expres pour qu'elle remonte la chaine d'appel. 
    }

    // Delete old image if it exists
    if (book.imageUrl) { // on verifie que c'est bien la bonne propriete.
      try { // await fs.promises -> Pour etre sur que la suppression soit faite avant de passer a l'update.
        await fs.promises.unlink(book.imageUrl); 
      } catch (err) {
        console.error('Failed to delete old image:', err);
        throw new Error('Failed to delete the old image, please try again.'); // Comme une bulle (Helper -> controleur -> MW)
      } 
    }

    // Update the book with the new image URL
    return Book.findByIdAndUpdate(book._id, { imageUrl: req.file.path }, { new: true, runValidators: true });
  }
  return null;
};

// Helper req.body
const updateBody = async (book, req) => {
  if (req.body) { 
    return Book.findByIdAndUpdate(book._id, req.body, { new: true, runValidators: true }); // runValidators permet de s'assurer que le modele est respecte pour les propriete renseignees.
  }
  return null;
};

// HELPERS UPDATE FUNCTION
// HELPERS UPDATE FUNCTION