require("dotenv").config();

const nodeEnv = process.env.NODE_ENV || "development";

const config = {
  PORT: process.env.PORT || 5000,
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || "http://localhost:8000",
  AI_SAMPLE_DATA_PATH:
    process.env.AI_SAMPLE_DATA_PATH || "../../ai/household_daily_clean.csv",
  TARIFF_PER_KWH: Number(process.env.TARIFF_PER_KWH || 1444.7),
  SQLITE_DB_PATH: process.env.SQLITE_DB_PATH || "data/smart-energy.sqlite",
  JWT_SECRET: process.env.JWT_SECRET || "",
  ALLOW_DUMMY_PREDICTION: process.env.ALLOW_DUMMY_PREDICTION === "true",
  ENABLE_DEMO_ENDPOINT:
    process.env.ENABLE_DEMO_ENDPOINT === "true" || nodeEnv !== "production",
  NODE_ENV: nodeEnv,
};

if (!config.JWT_SECRET) {
  if (config.NODE_ENV === "production") {
    throw new Error("JWT_SECRET wajib diisi pada environment production.");
  }

  config.JWT_SECRET = "secret_key_sementara";
}

module.exports = config;
