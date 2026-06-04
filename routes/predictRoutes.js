const express =
  require("express");

const router =
  express.Router();

const {
  predict,
} = require(
  "../controllers/predictController"
);

const {
  getPrediction,
} = require(
  "../controllers/predictionController"
);

router.post(
  "/",
  predict
);

router.get(
  "/latest",
  getPrediction
);

module.exports =
  router;