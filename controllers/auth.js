const path = require('path');
const ErrorResponse = require('../utlis/errorResponse');
const asyncHandler = require('../middelware/async');

const User = require('../models/User');

/*
 * @desc : Register user
 * @route : POST /api/v1/auth/register
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

  /**
   * @statics: Called on the Model
   * @method: Called on the actaull user which got from Model
   */

  //Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

/*
 * @desc : Login user
 * @route : POST /api/v1/auth/login
 * @access : PUBLIC
 */
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  //Check for User
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentails', 401));
  }

  //Check if password matches
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorResponse('Invalid credentails', 401));
  }

  //Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});
