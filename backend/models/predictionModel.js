const db = require("../config/database");

const createPrediction = async (userId, kwh, month, prediction) => {
  const normalizedMonth = month ?? null;

  const result = db
    .prepare(
      `
      INSERT INTO predictions
      (
        user_id,
        kwh,
        month,
        prediction
      )
      VALUES (?, ?, ?, ?)
      `
    )
    .run(userId, kwh, normalizedMonth, prediction);

  return Number(result.lastInsertRowid);
};

const getAllPredictions = async (userId) => {
  return db
    .prepare(
      `
      SELECT *
      FROM predictions
      WHERE user_id = ?
      ORDER BY created_at DESC, id DESC
      `
    )
    .all(userId);
};

const getLatestPrediction = async (userId) => {
  return db
    .prepare(
      `
      SELECT *
      FROM predictions
      WHERE user_id = ?
      ORDER BY created_at DESC, id DESC
      LIMIT 1
      `
    )
    .get(userId);
};

module.exports = {
  createPrediction,
  getAllPredictions,
  getLatestPrediction,
};
