const Bootcamp = require('../models/Bootcamp')


/*
  * @route : GET /api/v1/bootcamps
  * @desc : Get all bootcamps
  * @access : PUBLIC
*/

exports.getBootCamps = (req, res, next) => {
   res.status(200).json({ success: true, msg: "Show all bootcamps" })
}

/*
  * @route : GET /api/v1/bootcamps/:id
  * @desc : Get Single bootcamp
  * @access : PUBLIC
*/
exports.getBootCamp = (req, res, next) => {
   res.status(200).json({ success: true, msg: `Show bootcamps ${req.params.id}` })
}

/*
  * @route : POST /api/v1/bootcamps
  * @desc : Create new bootcamp
  * @access : Private
*/
exports.createBootCamp = async (req, res, next) => {
   try{
      const bootcamp = await Bootcamp.create(req.body)
      res.status(201).json({ success: true, data: bootcamp })
   }catch(err){
      res.status(400).json({ success: false, })
   }
}

/*
 * @route : PUT /api/v1/bootcamps/:id
 * @desc : Update bootcamp
 * @access : Private
*/
exports.updateBootCamp = (req, res, next) => {
   res.status(200).json({ success: true, msg: `Update bootcamps ${req.params.id}` })
}


/*
 * @route : DELETE /api/v1/bootcamps/:id
 * @desc : delete bootcamp
 * @access : Private
*/
exports.deleteBootCamp = (req, res, next) => {
   res.status(200).json({ success: true, msg: `Delete bootcamps ${req.params.id}` })
}