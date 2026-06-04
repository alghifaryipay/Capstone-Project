const express = require('express');
const router = express.Router();

const healthRoutes  = require('./healthRoutes');
const predictRoutes = require('./predictRoutes');
const historyRoutes = require('./historyRoutes');
const userRoutes    = require('./userRoutes');

// ─── GET  /api/health   ───────────────────
router.use('/health', healthRoutes);

// ─── POST /api/predict  ───────────────────
router.use('/predict', predictRoutes);

// ─── GET  /api/history  ───────────────────
router.use('/history', historyRoutes);

// ─── GET  /api/user     ───────────────────
router.use('/user', userRoutes);

module.exports = router;
