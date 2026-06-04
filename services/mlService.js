const axios = require('axios');
const config = require('../config/env');

const ML_URL = config.ML_SERVICE_URL;

/**
 * Mengirim request prediksi ke Python ML Service (FastAPI)
 *
 * @param {Object} payload - { kwh: number, month: string }
 * @returns {Promise<{ prediction: number, status: string, source: string }>}
 *
 * Ketika model AI selesai, cukup update URL atau format request di sini.
 * Frontend dan Routes TIDAK perlu diubah sama sekali.
 */
const getPrediction = async (payload) => {
  try {
    const response = await axios.post(`${ML_URL}/predict`, payload, {
      timeout: 10000, // 10 detik timeout
      headers: { 'Content-Type': 'application/json' },
    });

    return {
      prediction: response.data.prediction,
      status: response.data.status,
      source: 'ml-service',
    };
  } catch (error) {
    // ─── ML Service belum aktif → pakai response dummy ───────────────
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.warn('⚠️  ML Service belum aktif, menggunakan response dummy');

      // 👇 SABUK PENGAMAN: Pastikan kwh berupa angka valid. Jika tidak, jadikan 0.
      const safeKwh = Number(payload.kwh) || 0;

      // 👇 KALKULASI AMAN: Gunakan safeKwh agar hasil tidak pernah menjadi NaN
      const dummyPrediction =
        Math.round((safeKwh * 1.05 + Math.random() * 10) * 10) / 10;

      return {
        prediction: dummyPrediction,
        status: 'success',
        source: 'dummy',
      };
    }

    // ─── Error lain: lempar ke errorHandler ──────────────────────────
    const err = new Error(`ML Service Error: ${error.message}`);
    err.statusCode = 502;
    throw err;
  }
};

module.exports = { getPrediction };