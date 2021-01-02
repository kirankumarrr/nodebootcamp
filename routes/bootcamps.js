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

router.route('/radius/:zipcode/:distance').get(getBootCampsInRadius);

//Include other resources routers

const courseRouter = require('./courses');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/')
  .get(advanceResults(Bootcamp, 'courses'), getBootCamps) //Implemted middleware
  .post(createBootCamp);

router
  .route('/:id')
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

router.route('/:id/photo').put(bootCampPhotoUpload);

module.exports = router;
