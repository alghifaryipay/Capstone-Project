const app = require('./app');
const config = require('./config/env');

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀  Server berjalan di  http://localhost:${PORT}`);
  console.log(`📡  ML Service URL      ${config.ML_SERVICE_URL}`);
  console.log(`🌍  Environment         ${config.NODE_ENV}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Endpoint yang tersedia:');
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log(`  POST http://localhost:${PORT}/api/predict`);
  console.log(`  GET  http://localhost:${PORT}/api/history`);
  console.log(`  GET  http://localhost:${PORT}/api/user`);
  console.log(`  GET  http://localhost:${PORT}/api/predict/latest`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
