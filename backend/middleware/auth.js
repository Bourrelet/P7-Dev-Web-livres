module.exports = (req, res, next) => {  
    try {
      const token = req.header('Authorization')?.replace('Bearer ', ''); // Extrait le token de l'header
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode le token
      req.user = decoded; // Ajoute a req la propriete user qui contient le payload consitue lors du jwt.sign
      next();  // Si aucune erreur
    } catch (err) {
      res.status(403).json({error: 'unauthorized request'}) // gestion locale de l'erreur specifique.
    }
  };
  


  
  