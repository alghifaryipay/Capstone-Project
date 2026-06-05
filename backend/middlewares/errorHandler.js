const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    statusCode,
    err.message,
  );

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
