module.exports = (err, req, res, next) => {
  console.error(err.stack); 
  const statusCode = err.status || 500; // status specifique OU 500
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Une erreur est survenue',  // message specifique OU generique
  });
};
