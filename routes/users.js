const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
} = require('../controllers/users');

const User = require('../models/User');

const advanceResults = require('../middelware/advanceResults');
const router = express.Router();
const { protect, authorize } = require('../middelware/auth');

//Protecting all below routes
router.use(protect);
router.use(authorize('admin'));
router.route('/').get(advanceResults(User), getUsers).post(createUser);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
