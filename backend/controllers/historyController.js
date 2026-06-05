const config = require("../config/env");
const { getAllPredictions } = require("../models/predictionModel");
const { roundTo } = require("../utils/numbers");

const getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const rows = await getAllPredictions(userId);

    const history = rows.map((item) => {
      const usage = roundTo(item.kwh);
      const prediction = roundTo(item.prediction);
      const bill = Math.round(prediction * config.TARIFF_PER_KWH);
      let status = "Low";

      if (prediction > 400) {
        status = "High";
      } else if (prediction > 250) {
        status = "Normal";
      }

      return {
        month: item.month,
        usage: `${usage} kWh`,
        bill,
        status,
      };
    });

    res.status(200).json({
      status: "success",
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHistory,
};
