require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || '',
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  AI_SAMPLE_DATA_PATH:
    process.env.AI_SAMPLE_DATA_PATH || '../../ai/household_daily_clean.csv',
  TARIFF_PER_KWH: Number(process.env.TARIFF_PER_KWH || 1444.7),
  LOCAL_STORE_PATH: process.env.LOCAL_STORE_PATH || 'data/local-store.json',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
