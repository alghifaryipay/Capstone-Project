const { body, validationResult } = require('express-validator');

/**
 * Validasi request POST /api/predict
 * Memastikan data dari React sudah benar sebelum dikirim ke ML Service
 */
const validatePredictRequest = [
  body('kwh')
    .notEmpty().withMessage('kwh wajib diisi')
    .isNumeric().withMessage('kwh harus berupa angka')
    .isFloat({ min: 0 }).withMessage('kwh tidak boleh bernilai negatif'),

  body('month')
    .notEmpty().withMessage('month wajib diisi')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Format month harus YYYY-MM  (contoh: 2026-06)'),

  // Cek hasil validasi, jika ada error → kirim response 400
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi request gagal',
        errors: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      });
    }
    next();
  },
];

module.exports = { validatePredictRequest };
