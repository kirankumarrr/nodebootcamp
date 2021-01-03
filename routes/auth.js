const express = require('express');
const { register, loginUser, getMe } = require('../controllers/auth');
const { protect, authorize } = require('../middelware/auth');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);

// router.post('/register', register);

module.exports = router;
