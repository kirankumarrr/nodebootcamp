const path = require('path');
const ErrorResponse = require('../utlis/errorResponse');
const asyncHandler = require('../middelware/async');

const User = require('../models/User');

/*
 * @desc : Register user
 * @route : GET /api/v1/auth/register
 * @access : PUBLIC
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  res.status(200).json({ success: true });
});
