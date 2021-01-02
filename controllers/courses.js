const Course = require('../models/Courses');
const ErrorResponse = require('../utlis/errorResponse');
const asyncHandler = require('../middelware/async');

/*
 * @route : GET /api/v1/courses
 * @route : GET /api/v1/bootcamps/:bootcampId/courses
 * @desc : Get all Courses
 * @access : PUBLIC
 */

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }

  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
