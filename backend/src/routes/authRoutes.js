const express = require('express');
const { signup, login, logout, getMe, onboard } = require('../controllers/authController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, getMe);
router.post('/onboard', auth, onboard);

module.exports = router;