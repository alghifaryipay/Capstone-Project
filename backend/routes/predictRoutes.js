const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware"); 

const {
  predict,
} = require("../controllers/predictController");

const {
  getPrediction,
} = require("../controllers/predictionController");

router.post(
  "/",
  protect, // Selipkan di sini!
  predict
);

router.post(
  "/demo",
  predict
);

router.get(
  "/latest",
  protect, // Selipkan di sini juga!
  getPrediction
);

module.exports = router;
