const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utlis/errorResponse')
const asyncHandler = require('../middelware/async')
/*
  * @route : GET /api/v1/bootcamps
  * @desc : Get all bootcamps
  * @access : PUBLIC
*/

exports.getBootCamps = asyncHandler(async (req, res, next) => {
   const bootcamp = await Bootcamp.find()
   res.status(200).json({ success: true, count:bootcamp.length,data: bootcamp })
})

/*
  * @route : GET /api/v1/bootcamps/:id
  * @desc : Get Single bootcamp
  * @access : PUBLIC
*/
exports.getBootCamp = asyncHandler(
   async (req, res, next) => {
      const getID = req.params.id
      const bootcamp = await Bootcamp.findById(getID)
      if(!bootcamp){
         return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
      }
      res.status(200).json({ success: true, data: bootcamp })
   }
)

/*
  * @route : POST /api/v1/bootcamps
  * @desc : Create new bootcamp
  * @access : Private
*/
exports.createBootCamp = asyncHandler(async (req, res, next) => {
   const bootcamp = await Bootcamp.create(req.body)
   res.status(201).json({ success: true, data: bootcamp })
})

/*
 * @route : PUT /api/v1/bootcamps/:id
 * @desc : Update bootcamp
 * @access : Private
*/
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
   const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
      new:true, //get the updated the data
      runValidators:true // mongoose validators
   })
   if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
   }
   res.status(200).json({ success: true, data: bootcamp })
})


/*
 * @route : DELETE /api/v1/bootcamps/:id
 * @desc : delete bootcamp
 * @access : Private
*/
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
   const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
   if(!bootcamp){
      return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
   }
   res.status(200).json({ success: true, data: {}, count:bootcamp.length })
})