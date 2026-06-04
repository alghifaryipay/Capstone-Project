const {
  getAllPredictions,
} = require("../models/predictionModel");

const getHistory = async (
  req,
  res,
  next
) => {
  try {

    const rows =
      await getAllPredictions();

    const history =
      rows.map((item) => {

        const bill =
          Math.round(
            Number(
              item.prediction
            ) * 1444
          );

        let status =
          "Low";

        if (
          Number(
            item.prediction
          ) > 400
        ) {
          status = "High";
        } else if (
          Number(
            item.prediction
          ) > 250
        ) {
          status = "Normal";
        }

        return {
          month: item.month,
          usage: `${item.kwh} kWh`,
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