const db = require("../config/database");
const localStore = require("../services/localStore");

const warnFallback = (operation, error) => {
  console.warn(
    `Database ${operation} gagal, memakai local JSON store: ${error.message}`
  );
};

// Tambahkan userId sebagai parameter pertama
const createPrediction = async (userId, kwh, month, prediction) => {
  try {
    const [result] = await db.query(
      `
        INSERT INTO predictions
        (
          user_id,    /* Tambahkan kolom user_id */
          kwh,
          month,
          prediction
        )
        VALUES (?, ?, ?, ?)
        `,
      [userId, kwh, month, prediction] // Masukkan userId ke dalam array value
    );

    return result.insertId;
  } catch (error) {
    warnFallback("createPrediction", error);
    return localStore.insertPrediction(userId, kwh, month, prediction);
  }
};

// Tambahkan userId sebagai parameter
const getAllPredictions = async (userId) => {
  try {
    const [rows] = await db.query(
      `
          SELECT *
          FROM predictions
          WHERE user_id = ?    /* Filter hanya untuk user ini */
          ORDER BY created_at DESC
          `,
      [userId]
    );

    return rows;
  } catch (error) {
    warnFallback("getAllPredictions", error);
    return localStore.listPredictions(userId);
  }
};

// Tambahkan userId sebagai parameter
const getLatestPrediction = async (userId) => {
  try {
    const [rows] = await db.query(
      `
          SELECT *
          FROM predictions
          WHERE user_id = ?    /* Filter hanya untuk user ini */
          ORDER BY id DESC
          LIMIT 1
        `,
      [userId]
    );

    return rows[0];
  } catch (error) {
    warnFallback("getLatestPrediction", error);
    return localStore.getLatestPrediction(userId);
  }
};

module.exports = {
  createPrediction,
  getAllPredictions,
  getLatestPrediction,
};
