require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  AI_SAMPLE_DATA_PATH:
    process.env.AI_SAMPLE_DATA_PATH || '../../ai/household_daily_clean.csv',
  TARIFF_PER_KWH: Number(process.env.TARIFF_PER_KWH || 1444.7),
  SQLITE_DB_PATH: process.env.SQLITE_DB_PATH || 'data/smart-energy.sqlite',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
