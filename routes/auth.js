const express = require('express');
const { register } = require('../controllers/auth');

const router = express.Router();

router.route('/register').post(register);

// router.post('/register', register);

module.exports = router;
