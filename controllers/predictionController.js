const {
  getLatestPrediction,
} = require(
  "../models/predictionModel"
);

const getPrediction =
  async (
    req,
    res,
    next
  ) => {

    try {

      const data =
        await getLatestPrediction();

      if (!data) {
        return res
          .status(404)
          .json({
            status: "error",
            message:
              "No prediction found",
          });
      }

      res.json({
        status: "success",

        data: {
          predictedUsage:
            Number(
              data.prediction
            ),

          predictedBill:
            Math.round(
              Number(
                data.prediction
              ) * 1444
            ),

          forecastMonth:
            data.month,
        },
      });

    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getPrediction,
};