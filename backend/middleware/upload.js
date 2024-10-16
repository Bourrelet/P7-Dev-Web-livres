const multer = require('multer');
const storage = multer.memoryStorage(); // stockage temporaire dans la RAM
const upload = multer({ storage: storage }); // Initialisation de Multer avec memoryStorage

module.exports = upload;

