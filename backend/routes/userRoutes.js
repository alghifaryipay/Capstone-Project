const express = require('express');
const router = express.Router();
const { register, login, getUserProfile } = require('../controllers/userController');

router.post('/register', register);

router.post('/login', login);

router.get('/', getUserProfile);

module.exports = router;
