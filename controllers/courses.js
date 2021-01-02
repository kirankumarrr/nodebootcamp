const Course = require('../models/Courses');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utlis/errorResponse');
const asyncHandler = require('../middelware/async');
const Courses = require('../models/Courses');

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
    // query = Course.find().populate('bootcamp'); // Get all bootcamp fields as a child
    // Get sepcific fields from bootcamp
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

/*
 * @route : GET /api/v1/courses/:id
 * @desc : Get single Course
 * @access : PUBLIC
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    count: course.length,
    data: course,
  });
});

/*
 * @route : POST /api/v1/bootcamps/:bootcampId/courses
 * @desc : POST Course
 * @access : PRIVATE
 */
exports.addCourse = asyncHandler(async (req, res, next) => {
  //Assign Id to bootcamp inside course Object
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  console.log(' req.params.bootcampId', bootcamp);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

/*
 * @route : PUT /api/v1/courses/:id
 * @desc : PUT Course
 * @access : PRIVATE
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(
        `No course with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

/*
 * @route : PUT /api/v1/courses/:id
 * @desc : PUT Course
 * @access : PRIVATE
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(
        `No course with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
