const mongoose = require('mongoose');

const livreSchema =({
 userId : { type: String, required: true },
 title : { type: String, required: true },
 author: { type: String, required: true },
 year: { type: String, required: true },
 genre: { type: String, required: true }
});

module.exports = mongoose.model('livre', livreSchema);