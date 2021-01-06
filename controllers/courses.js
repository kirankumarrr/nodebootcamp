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
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    return res.status(200).json(res.advanceResults);
  }
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
  //Add user to req.body
  //Not user details are available in req which was injected in middelware
  req.body.user = req.user.id;

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

  //Check for existin user and ignore if its admin
  if (
    bootcamp &&
    bootcamp.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to ${bootcamp._id}`,
        400
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

  //Make sure user is course owner or admin
  if (
    course &&
    course.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this course`,
        400
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

  //Make sure user is course owner or admin
  if (
    course &&
    course.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this course`,
        400
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
