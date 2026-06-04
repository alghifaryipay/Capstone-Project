const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config/env');

const ML_URL = config.ML_SERVICE_URL;
const ENERGY_COLUMNS = [
  'datetime',
  'Global_active_power',
  'Global_reactive_power',
  'Voltage',
  'Global_intensity',
  'Sub_metering_1',
  'Sub_metering_2',
  'Sub_metering_3',
];

const parseCsvLine = (line) => {
  const values = line.split(',');
  return ENERGY_COLUMNS.reduce((record, column, index) => {
    record[column] = column === 'datetime' ? values[index] : Number(values[index]);
    return record;
  }, {});
};

const loadDemoWindow = () => {
  const csvPath = path.resolve(__dirname, config.AI_SAMPLE_DATA_PATH);
  const content = fs.readFileSync(csvPath, 'utf8').trim();
  const lines = content.split(/\r?\n/).slice(1);
  return lines.slice(-30).map(parseCsvLine);
};

const buildAiPayload = (payload) => {
  if (Array.isArray(payload.records) && payload.records.length >= 30) {
    return {
      records: payload.records,
      tariff_per_kwh: payload.tariff_per_kwh || config.TARIFF_PER_KWH,
    };
  }

  const records = loadDemoWindow();
  const estimatedMonthlyKwh = Number(payload.kwh || 0);
  if (estimatedMonthlyKwh > 0) {
    const estimatedDailyKwh = estimatedMonthlyKwh / 30;
    const estimatedActivePower = estimatedDailyKwh / 24;
    records[records.length - 1] = {
      ...records[records.length - 1],
      Global_active_power: estimatedActivePower,
    };
  }

  return {
    records,
    tariff_per_kwh: payload.tariff_per_kwh || config.TARIFF_PER_KWH,
  };
};

/**
 * Mengirim request prediksi ke Python ML Service (FastAPI)
 *
 * @param {Object} payload - { kwh, month } dari FE atau { records } native AI.
 * @returns {Promise<{ prediction: number, status: string, source: string }>}
 *
 * Backend menjaga kontrak lama FE sambil menerjemahkannya ke kontrak FastAPI AI.
 */
const getPrediction = async (payload) => {
  try {
    const aiPayload = buildAiPayload(payload);
    const response = await axios.post(`${ML_URL}/predict`, aiPayload, {
      timeout: 10000, // 10 detik timeout
      headers: { 'Content-Type': 'application/json' },
    });
    const aiResult = response.data;
    const estimatedDailyKwh = Number(aiResult.estimated_daily_kwh || 0);
    const estimatedMonthlyKwh = estimatedDailyKwh * 30;
    const prediction = Number(estimatedMonthlyKwh.toFixed(2));

    return {
      prediction,
      dailyKwh: Number(estimatedDailyKwh.toFixed(2)),
      activePower: Number(aiResult.prediction_original || 0),
      estimatedCost:
        aiResult.estimated_daily_cost != null
          ? Math.round(aiResult.estimated_daily_cost * 30)
          : Math.round(prediction * config.TARIFF_PER_KWH),
      nextDate: aiResult.next_date,
      status: 'success',
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
        dailyKwh: Number((dummyPrediction / 30).toFixed(2)),
        activePower: 0,
        estimatedCost: Math.round(dummyPrediction * config.TARIFF_PER_KWH),
        nextDate: null,
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
