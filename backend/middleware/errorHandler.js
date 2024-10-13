module.exports = (err, req, res, next) => {
  console.error(err.stack);  // Log l'erreur pour le développement
  const statusCode = err.status || 500;  // Par défaut, statut 500 pour les erreurs
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Une erreur est survenue',  // Utilise le message de l'erreur ou un message générique
  });
};
