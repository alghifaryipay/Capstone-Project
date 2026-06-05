const mlService = require("../services/mlService");

const {
  createPrediction,
} = require("../models/predictionModel");
const { roundTo } = require("../utils/numbers");

const predict = async (req, res, next) => {
  try {
    const { kwh, month } = req.body;

    const userId = req.user?.id;

    const result = await mlService.getPrediction({
      ...req.body,
      kwh,
      month,
    });

    if (userId) {
      try {
        const predictionValue = roundTo(result.prediction);
        const inputKwh = Number(kwh);
        const storedKwh = Number.isFinite(inputKwh) && inputKwh > 0
          ? roundTo(inputKwh)
          : predictionValue;
        const forecastMonth = month || result.nextDate || null;

        await createPrediction(
          userId,
          storedKwh,
          forecastMonth,
          predictionValue
        );
      } catch (dbError) {
        console.warn("Prediksi berhasil, tetapi penyimpanan DB gagal:", dbError.message);
      }
    }

    const predictedBill = result.estimatedCost;

    res.status(200).json({
      status: "success",
      data: {
        predictedUsage: result.prediction,
        predictedBill,
        forecastMonth: month || result.nextDate || null,
        dailyKwh: result.dailyKwh,
        activePower: result.activePower,
        nextDate: result.nextDate,
        source: result.source || "ml-service",
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  predict,
};
