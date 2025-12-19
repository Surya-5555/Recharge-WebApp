const express = require('express');
const { updateProfile, exportUserData, deleteAccount } = require('../controllers/userController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.put('/profile', auth, updateProfile);
router.get('/export-data', auth, exportUserData);
router.delete('/account', auth, deleteAccount);

module.exports = router;