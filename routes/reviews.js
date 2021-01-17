const express = require('express');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');
const Review = require('../models/Review');
const advanceResults = require('../middelware/advanceResults');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middelware/auth');
router
  .route('/')
  .get(
    advanceResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
