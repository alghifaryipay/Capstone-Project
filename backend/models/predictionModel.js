const db = require("../config/database");

// Tambahkan userId sebagai parameter pertama
const createPrediction = async (userId, kwh, month, prediction) => {
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
};

// Tambahkan userId sebagai parameter
const getAllPredictions = async (userId) => {
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
};

// Tambahkan userId sebagai parameter
const getLatestPrediction = async (userId) => {
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
};

module.exports = {
  createPrediction,
  getAllPredictions,
  getLatestPrediction,
};