const mysql = require("mysql2/promise");
const config = require("./env");

const pool = config.DATABASE_URL
  ? mysql.createPool(config.DATABASE_URL)
  : mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "smart_energy_db",
      waitForConnections: true,
      connectionLimit: 10,
    });

module.exports = pool;
