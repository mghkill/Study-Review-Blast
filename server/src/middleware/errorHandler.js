function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message);
  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    error: isDev ? err.message : 'Internal Server Error',
  });
}
module.exports = { errorHandler };
