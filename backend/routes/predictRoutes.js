const express = require("express");
const router = express.Router();

const config = require("../config/env");
const { protect } = require("../middlewares/authMiddleware");
const { predict } = require("../controllers/predictController");
const { getPrediction } = require("../controllers/predictionController");

router.post("/", protect, predict);
router.get("/latest", protect, getPrediction);

if (config.ENABLE_DEMO_ENDPOINT) {
  router.post("/demo", predict);
}

module.exports = router;
