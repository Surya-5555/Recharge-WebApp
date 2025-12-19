const express = require('express');
const { getPlans, seedPlans } = require('../controllers/rechargeController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Recharge API is working' });
});
router.get('/plans', auth, getPlans);
router.post('/seed-plans', auth, seedPlans);

module.exports = router;