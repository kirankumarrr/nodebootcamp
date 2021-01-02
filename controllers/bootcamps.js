const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utlis/errorResponse');
const geocoder = require('../utlis/geocoder');
const asyncHandler = require('../middelware/async');
/*
 * @route : GET /api/v1/bootcamps
 * @desc : Get all bootcamps
 * @access : PUBLIC
 */

exports.getBootCamps = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  /**
   * @desc :Reason to Fields to exclude
   *       :get all the records without any quertString
   */
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //loops and remove fields
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);
  console.log(queryStr);

  /**
   * /b : search at the beginning of a word in a string:
   * query:{{URL}}/api/v1/bootcamps?averageCost[gte]=1000&location.city=Lowell&careers[in]=Mobile Development
   */

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding resource
  //Note: Added populate for course modal in bootcamps
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  //Selected Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    //selecting specific fields out the resources received from DB
    query = query.select(fields);
  }

  //Sort
  //Sorting it by mulitple fields

  //TODO: Why its failing
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    //Sort default by date
    //1 : ascending  & -1:descending
    query = query.sort('-createdAt');
  }

  /**
   * @QueryOperation: pagination
   * @desc :"creating pagination"
   */

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalDocuments = await Bootcamp.countDocuments();
  query = query.skip(startIndex).limit(limit);

  //Executing query
  let bootcamp = await query;

  //Pagination result

  const pagination = {};
  if (endIndex < totalDocuments) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  console.log('bootcamp', bootcamp);
  res.status(200).json({
    success: true,
    count: bootcamp.length,
    pagination,
    data: bootcamp,
  });
});

/*
 * @route : GET /api/v1/bootcamps/:id
 * @desc : Get Single bootcamp
 * @access : PUBLIC
 */
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const getID = req.params.id;
  const bootcamp = await Bootcamp.findById(getID);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

/*
 * @route : POST /api/v1/bootcamps
 * @desc : Create new bootcamp
 * @access : Private
 */
exports.createBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

/*
 * @route : PUT /api/v1/bootcamps/:id
 * @desc : Update bootcamp
 * @access : Private
 */
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //get the updated the data
    runValidators: true, // mongoose validators
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

/*
 * @route : DELETE /api/v1/bootcamps/:id
 * @desc : delete bootcamp
 * @access : Private
 */
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  //When course added to bootcamp and try to delete bootcamp we need
  //to delete courses too which are mapped to this bootcamp
  //   We added middleware in Schema Modal but FindByIDandDelete wont call remove middleware method
  //   const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  //Added new Middelware in Schema Modal
  bootcamp.remove();

  res.status(200).json({ success: true, data: {}, count: bootcamp.length });
});

/*
 * @route : GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @desc : get bootcamp within the radius of zipcode and distance.
 * @access : Private
 */
exports.getBootCampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  //GET lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Calculate radius using radains
  // Divide distane by radius of the Earth
  // Earth radius = 3,963 miles / 6378.1 kilometers
  const radius = distance / 3963;

  //TODO: This is advance query
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
