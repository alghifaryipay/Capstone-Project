const express = require("express");
const router = express.Router();

const healthRoutes = require("./healthRoutes");
const predictRoutes = require("./predictRoutes");
const historyRoutes = require("./historyRoutes");
const userRoutes = require("./userRoutes");

router.use("/health", healthRoutes);
router.use("/predict", predictRoutes);
router.use("/history", historyRoutes);
router.use("/user", userRoutes);

module.exports = router;
