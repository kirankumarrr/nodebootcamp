const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utlis/errorResponse');
const geocoder = require('../utlis/geocoder');
const asyncHandler = require('../middelware/async');
/*
 * @route : GET /api/v1/bootcamps
 * @desc : Get all bootcamps
 * @access : PUBLIC
 */

const dotenv = require('dotenv');
//Load env var's
dotenv.config({ path: './config/config.env' });

exports.getBootCamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
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

/*
 * @route : PUT /api/v1/bootcamps/:id/photo
 * @desc : Upload photo for bootcamp
 * @access : Private
 */

exports.bootCampPhotoUpload = asyncHandler(async (req, res, next) => {
  //https://www.pexels.com/search/coding/: Free images : noCopyrights
  const id = req.params.id;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${id}`, 404));
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;
  //Validation : isImage is a photo?
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  //check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} KB`,
        400
      )
    );
  }

  //Creating new Unique When photo is uploaded.
  //path : helps us to figure which extension the file upload,since we are renaming the filename.
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    console.error(err);
    if (err) return next(new ErrorResponse(`Problem with file upload`, 500));

    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });
    res.status(200).json({
      status: true,
      data: file.name,
    });
  });
  console.log(file.name);
});
