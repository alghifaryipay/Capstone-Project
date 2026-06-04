const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ─────────────────────────────────────────
//  Middleware Global
// ─────────────────────────────────────────
app.use(cors());                                  // Izinkan request dari React (cross-origin)
app.use(express.json());                          // Parse body JSON
app.use(express.urlencoded({ extended: true }));  // Parse form data

// ─────────────────────────────────────────
//  Routes
// ─────────────────────────────────────────
app.use('/api', routes);

// Fallback: route tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
});

// ─────────────────────────────────────────
//  Error Handler (harus paling bawah)
// ─────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
