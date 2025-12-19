const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const rechargeRoutes = require('./rechargeRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/recharge', rechargeRoutes);

module.exports = router;