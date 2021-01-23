const path = require('path');
const ErrorResponse = require('../utlis/errorResponse');
const asyncHandler = require('../middelware/async');
const sendEmail = require('../utlis/sendEmail');
const dotenv = require('dotenv');
const crypto = require('crypto');
//Load env var's
dotenv.config({ path: './config/config.env' });
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

  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

/*
 * @desc : Login user
 * @route : POST /api/v1/auth/login
 * @access : PRIVATE
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    date: user,
  });
});

/*
 * @desc : Update User Details
 * @route : PUT /api/v1/auth/updatedetails
 * @access : PRIVATE
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  console.log('req.user', req.user);
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    date: user,
  });
});

/*
 * @desc : Update User Password
 * @route : POST /api/v1/auth/updatepassword
 * @access : PRIVATE
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  //Check current password
  if (await user.matchPassword(req.body.currentPassword)) {
    return next(new ErrorResponse('Password is incorrect', 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/*
 * @desc : Reset pasword
 * @route : POST /api/v1/auth/resetpassword/:resettoken
 * @access : PUBLIC
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //GET hashed password
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  console.log('resetPasswordToken', resetPasswordToken);
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  console.log('resetPasswordToken', user);
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  //Set new password
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

/*
 * @desc : Forgot Password
 * @route : POST /api/v1/auth/forgotpassword
 * @access : PUBLIC
 */
exports.forgotpassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that Email', 404));
  }

  //Reset Token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  console.log('resetToken', resetToken);

  //Create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `PUT Request to :\n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset',
      message,
    });
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not reset', 500));
  }

  res.status(200).json({
    success: true,
    date: user,
  });
});

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

/*
 * @desc : Login user OUT / clear cookie
 * @route : POST /api/v1/auth/logout
 * @access : PRIVATE
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    date: {},
  });
});
