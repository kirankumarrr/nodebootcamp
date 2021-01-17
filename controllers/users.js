const path = require('path');
const ErrorResponse = require('../utlis/errorResponse');
const asyncHandler = require('../middelware/async');
const dotenv = require('dotenv');
const crypto = require('crypto');
//Load env var's
dotenv.config({ path: './config/config.env' });
const User = require('../models/User');

/*
 * @desc : Get all Users
 * @route : GET /api/v1/auth/users
 * @access : PRIVATE/Admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
});

/*
 * @desc : Get single User
 * @route : POST /api/v1/auth/users:/id
 * @access : PRIVATE/Admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(201).json({
    success: true,
    data: user,
  });
});

/*
 * @desc : Create new User
 * @route : POST /api/v1/auth/users
 * @access : PRIVATE/Admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

/*
 * @desc : Update User
 * @route : PUT /api/v1/auth/users/:id
 * @access : PRIVATE/Admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

/*
 * @desc : Delete User
 * @route : DELETE /api/v1/auth/users/:id
 * @access : PRIVATE/Admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
