const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {  // async ???
  console.log('Auth middleware triggered');
    try {
      const token = req.header('Authorization')?.replace('Bearer ', ''); // Extrait le token de l'header
      console.log('Token extrait:', token); // Vérifie ce qui est extrait de l'en-tête
      console.log('JWT_SECRET utilisé dans auth middleware:', process.env.JWT_SECRET);
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode le token
      req.user = decoded; // Ajoute a req la propriete user qui contient le payload consitue lors du jwt.sign (userId = user._id)
      console.log('Decoded token:', decoded); // Devrait montrer { userId: "valeur_de_l_ID" }
      next();  // Si aucune erreur
    } catch (err) {
      res.status(403).json({error: 'unauthorized request'}) // gestion locale de l'erreur specifique.
    }
  };
  


  
  