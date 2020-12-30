const express = require('express')
const { getBootCamp, getBootCamps, createBootCamp, updateBootCamp, deleteBootCamp,
  getBootCampsInRadius } = require('../controllers/bootcamps')

const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getBootCampsInRadius)

router.route('/')
  .get(getBootCamps)
  .post(createBootCamp)

router.route('/:id')
      .get(getBootCamp)
      .put(updateBootCamp)
      .delete(deleteBootCamp)

module.exports = router