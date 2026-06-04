const mlService =
  require("../services/mlService");

const {
  createPrediction,
} = require("../models/predictionModel");

const predict = async (
  req,
  res,
  next
) => {
  try {

    const {
      kwh,
      month,
    } = req.body;

    const result =
      await mlService.getPrediction({
        kwh,
        month,
      });

    await createPrediction(
      kwh,
      month,
      result.prediction
    );

    const predictedBill =
      Math.round(
        result.prediction * 1444
      );

    res.status(200).json({
      status: "success",

      data: {
        predictedUsage:
          result.prediction,

        predictedBill,

        forecastMonth:
          month,

        source:
          result.source ||
          "ml-service",
      },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  predict,
};