// controlleur signin
// const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // creation du token
// res.json({ token }); // envoi du token en reponse.
// controlleur signin

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        const err = new Error('Accès refusé. Aucun token fourni.')
        err.status = 401
        return next(err)
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // 
      req.user = decoded; // modifie la propriete user de la requete
      next();  // Passer à la route suivante si le token est valide
    } catch (err) {
        throw new Error('403: unauthorized request');      
    }
  };
  