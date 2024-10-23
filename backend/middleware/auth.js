const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {  
  console.log('Auth middleware triggered');
    try {
      const token = req.header('Authorization')?.replace('Bearer ', ''); 
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      req.user = decoded; 
      next();  // Si aucune erreur
    } catch (err) {
      res.status(403).json({error: 'unauthorized request'})
    }
  };
  


  
  