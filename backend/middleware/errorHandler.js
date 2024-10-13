app.use((err, req, res, next) => {
  console.error(err.stack);  // Log l'erreur pour le développement
  
  // Gérer les erreurs de validation (Mongoose)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'fail',
      message: "Erreur de validation des données",
      details: err.message  // Renvoie le message d'erreur de Mongoose
    });
  }

  // Gérer les erreurs de cast (Mongoose, par ex. mauvais ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'fail',
      message: `Type de donnée incorrect à l'attribut ${err.path}`,
      details: err.message  // Détail de l'erreur
    });
  }

  // Gérer les erreurs d'unicité (Mongoose)
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).json({
      status: 'fail',
      message: "Contrainte d'unicité violée. L'enregistrement existe déjà.",
      details: err.message
    });
  }

  // Gérer les erreurs de document non trouvé (Mongoose)
  if (err.name === 'DocumentNotFoundError') {
    return res.status(404).json({
      status: 'fail',
      message: "Document introuvable.",
      details: err.message
    });
  }

  // Pour toute autre erreur, renvoie une erreur interne par défaut
  res.status(500).json({
    status: 'error',
    message: "Une erreur interne est survenue.",
    details: err.message
  });
});