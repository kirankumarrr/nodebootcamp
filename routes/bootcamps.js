const express = require('express');
const {
  getBootCamp,
  getBootCamps,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootCampsInRadius,
  bootCampPhotoUpload,
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/Bootcamp');
const advanceResults = require('../middelware/advanceResults');
const router = express.Router();
const { protect, authorize } = require('../middelware/auth');

router.route('/radius/:zipcode/:distance').get(getBootCampsInRadius);

//Include other resources routers

const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router
  .route('/')
  .get(advanceResults(Bootcamp, 'courses'), getBootCamps) //Implemted middleware
  .post(protect, authorize('publisher', 'admin'), createBootCamp);

router
  .route('/:id')
  .get(getBootCamp)
  .put(protect, authorize('publisher', 'admin'), updateBootCamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootCamp);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootCampPhotoUpload);

module.exports = router;
