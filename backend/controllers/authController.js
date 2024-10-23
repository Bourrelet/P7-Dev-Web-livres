const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 

// Enregistrement nouvel utilisateur
exports.signupUser = async (req, res, next) => { 
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); 

    const newUser = new User({ 
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save(); 

    res.status(201).json({ message: 'Utilisateur créé avec succès' });  
  } catch (error) {
    next(error);
  }
};

// Connexion utilisateur
exports.loginUser = async (req, res, next) => {
  try {  
    const user = await User.findOne({ email: req.body.email });    
    const userId = user._id;
    console.log(userId);

    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);  
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });  
    }

    const token = jwt.sign({userId: userId}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ userId: userId, token: token }); 

  } catch (error) {
    next(error);
  }
};
