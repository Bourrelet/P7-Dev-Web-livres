const mongoose = require('mongoose');

// Schéma des livres
const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },  
  year: { type: Number, required: true }, 
  genre: { type: String, required: true }, 
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true, min: 0, max: 5 }
    }
  ],  // Tableau d'évaluations
  averageRating: { type: Number, default: 0 },
}, {
  timestamps: true  
});

module.exports = mongoose.model('Book', bookSchema);
