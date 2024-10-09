const mongoose = require('mongoose');

// Schéma des évaluations
const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  grade: { type: Number, required: true, min: 0, max: 5 }
});

// Schéma des livres
const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  ratings: [ratingSchema],  // Tableau d'évaluations
  averageRating: { type: Number, default: 0 },
  image: { type: String, required: true },  // URL de l'image
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
