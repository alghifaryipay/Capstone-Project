const express = require('express');
const router = express.Router();
const { register, login, getUserProfile } = require('../controllers/userController');

// Route POST untuk Register
router.post('/register', register);

// Route POST untuk Login
router.post('/login', login);

// Route GET untuk mengambil data profil user
router.get('/', getUserProfile);

module.exports = router;