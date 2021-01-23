const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utlis/errorResponse');
const User = require('../models/User');
const dotenv = require('dotenv');
//Load env var's
dotenv.config({ path: './config/config.env' });
// PROTECT ROUTES
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  let authorization = req.headers.authorization;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  // else if (req.cookies.token) {
  //   console.log('req.cookies.token', req.cookies.token);
  //   token = req.cookies.token;
  // }

  //check isToken Exist ?
  if (!token) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }
  try {
    //Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decodedToken.id);
    req.user = currentUser;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }
});

//Grant access to specifc role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is  not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
