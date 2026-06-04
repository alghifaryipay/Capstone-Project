/**
 * Global Error Handler
 * Semua error yang melewati next(error) akan ditangkap di sini
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(`❌ [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.error(`   Status : ${statusCode}`);
  console.error(`   Error  : ${err.message}`);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    // Stack trace hanya tampil di mode development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
