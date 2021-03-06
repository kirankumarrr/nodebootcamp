const express = require('express');
const {
  register,
  loginUser,
  getMe,
  forgotpassword,
  resetPassword,
  updateDetails,
  logout,
} = require('../controllers/auth');
const { protect, authorize } = require('../middelware/auth');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);
router.route('/logout').get(protect, logout);
router.route('/updatedetails').put(protect, updateDetails);
router.post('/forgotpassword', forgotpassword);
router.put('/resetPassword/:resettoken', resetPassword);

// router.post('/register', register);

module.exports = router;
