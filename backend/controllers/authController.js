const bcrypt = require('bcryptjs'); // ??? needed ???
const jwt = require('jsonwebtoken'); // ??? needed ???
const User = require('../models/User');  // Modèle User qu'on a créé


exports.signupUser = async (req, res, next) => {  // Done Promise.All() pas possible ici car la deuxieme requete depend de la premiere.
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);  // Hachage du mot de passe

    const newUser = new User({  // Création de l'objet avec le mot de passe haché
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();  // Sauvegarde de l'utilisateur dans la base de données la DB va automatiquement lui attribuer un _id

    res.status(201).json({ message: 'Utilisateur créé avec succès' });  // Réponse de succès
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => { // On verifie les erreurs de logique metier synchrones avec IF ; try/catch sert juste a securiser les op asynchrones.
  try {  // Dans req.body on a le mail et le pw cryptes.
    const user = await User.findOne({ email: req.body.email });  // Si la DB plante par xpl -> catch()
    
    const userId = user._id;
    console.log(userId);
    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });  // Logique metier -> synchrone -> IF
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);  
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });  
    }

    const token = jwt.sign({userId: userId}, process.env.JWT_SECRET, { expiresIn: '1h' });  // Création du token avec dans le payload la variable userID qui contient l'id automatique de la DB de l'objet User
    res.json({ userId: userId,
      token: token });  // Réponse avec le token

  } catch (error) {
    next(error);
  }
};
