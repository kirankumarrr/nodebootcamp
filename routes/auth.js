const express = require('express');
const { register, loginUser } = require('../controllers/auth');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(loginUser);

// router.post('/register', register);

module.exports = router;
