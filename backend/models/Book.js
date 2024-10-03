const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
//  userId : { type: String, required: true }, 
 title : { type: String, required: true },
 author: { type: String, required: true },
 year: { type: String, required: true },
 genre: { type: String, required: true },
//  ratings: {type: Number, required: true },
//  averageRating: {type: Number, required: true },
 image: {type: File, required: true}
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;