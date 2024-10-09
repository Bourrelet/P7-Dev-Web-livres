const bcrypt = require('bcryptjs');
const User = require('../models/User');  // Modèle User qu'on a créé
// need importer les outils ?
// need importer  config pour secretjwt ?

exports.signupUser = async (req, res) => {

  const hashedPassword = await bcrypt.hash(req.body.password, 10); // hashage PW

  const newUser = new User({ // Creation nouvel objet modele
    email: req.body.email,
    password: hashedPassword,
  });

  await newUser.save(); // upload objet modele

  res.status(201).json({ message: 'Utilisateur créé avec succès' }); // reponse succes console frontend

  };



exports.loginUser = async (req, res) => {

  const user = await User.findOne({ email: req.body.email }); // recherche le mail de la requete login dans la DB

  if (!user) {
    return res.status(400).json({ message: 'Utilisateur non trouvé' }); // si pas trouve -> message d'erreur console frontend
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password); // comparaison pw requette avec pw DB
  if (!isMatch) {
    return res.status(400).json({ message: 'Mot de passe incorrect' }); // si pas match -> message console frontend
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // creation du token

  res.json({ token }); // envoi du token en reponse.
  

};