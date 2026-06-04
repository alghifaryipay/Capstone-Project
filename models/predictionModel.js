const db = require("../config/database");

const createPrediction = async (kwh, month, prediction) => {
  const [result] = await db.query(
    `
      INSERT INTO predictions
      (
        kwh,
        month,
        prediction
      )
      VALUES (?, ?, ?)
      `,
    [kwh, month, prediction],
  );

  return result.insertId;
};

const getAllPredictions = async () => {
  const [rows] = await db.query(
    `
        SELECT *
        FROM predictions
        ORDER BY created_at DESC
        `,
  );

  return rows;
};

const getLatestPrediction = async () => {
  const [rows] = await db.query(`
        SELECT *
        FROM predictions
        ORDER BY id DESC
        LIMIT 1
      `);

  return rows[0];
};

module.exports = {
  createPrediction,
  getAllPredictions,
  getLatestPrediction,
};
