const multer = require('multer');

const storage = multer.memoryStorage(); // stockage RAM
const upload = multer({ storage: storage }); // Initialisation

module.exports = upload;

