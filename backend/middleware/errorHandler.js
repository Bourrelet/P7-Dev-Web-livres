app.use((err, req, res, next) => {
    // Log l'erreur dans la console
    console.error(err.stack); // Ne jamais divulguer err.stack au client
    // err.stack revelerai les vulnerabilite du site.
  
    // Définit un statut par défaut si err.status n'est pas défini
    res.status(err.status || 500);
  
    // Envoie une réponse JSON avec le message d'erreur
    res.json({
      message: err.message, // Message d'erreur
      status: err.status,   // Statut HTTP
    });
  });
  