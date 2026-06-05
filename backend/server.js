const app = require('./app');
const config = require('./config/env');

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT} (${config.NODE_ENV})`);
  console.log(`ML service: ${config.ML_SERVICE_URL}`);
});
