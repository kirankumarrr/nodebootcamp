const Course = require('../models/Courses');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utlis/errorResponse');
const asyncHandler = require('../middelware/async');
const Courses = require('../models/Courses');
const Review = require('../models/Review');

/*
 * @desc : Get reviews
 * @route : GET /api/v1/bootcamps/:bootcampId/reviews
 * @access : PUBLIC
 */

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    return res.status(200).json(res.advanceResults);
  }
});

/*
 * @desc : Get single review
 * @route : GET /api/v1/reviews/:id
 * @access : PUBLIC
 */

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({
    success: true,
    data: review,
  });
});

/*
 * @desc : Add review
 * @route : POST /api/v1/bootcamps/:bootcampId/reviews
 * @access : Private
 */

exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No Bootcamp found with the id of ${req.params.id}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  return res.status(200).json({
    success: true,
    data: review,
  });
});

/*
 * @desc : Update review
 * @route : POST /api/v1/reviews/:id
 * @access : Private
 */

exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(
        `No Bootcamp found with the id of ${req.params.id}`,
        404
      )
    );
  }

  //Review belongs to inserted user or admin
  if (review.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update the review`, 401));
  }

  const reviewDetails = await Review.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    data: reviewDetails,
  });
});

/*
 * @desc : Delete review
 * @route : POST /api/v1/reviews/:id
 * @access : Private
 */

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(
        `No Bootcamp found with the id of ${req.params.id}`,
        404
      )
    );
  }

  //Review belongs to inserted user or admin
  if (review.user.id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update the review`, 401));
  }

  await Review.remove();

  return res.status(200).json({
    success: true,
    data: {},
  });
});
