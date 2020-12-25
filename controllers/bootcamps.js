const Bootcamp = require('../models/Bootcamp')


/*
  * @route : GET /api/v1/bootcamps
  * @desc : Get all bootcamps
  * @access : PUBLIC
*/

exports.getBootCamps = async (req, res, next) => {
   try{
      const bootcamp = await Bootcamp.find()
      res.status(200).json({ success: true, data: bootcamp,count:bootcamp.length })
   }catch(err){
      res.status(400).json({ success: false, })
   }
}

/*
  * @route : GET /api/v1/bootcamps/:id
  * @desc : Get Single bootcamp
  * @access : PUBLIC
*/
exports.getBootCamp = async (req, res, next) => {
   try{
      const getID = req.params.id
      const bootcamp = await Bootcamp.findById(getID)
      if(!bootcamp){
         return res.status(400).json({ success: false, })
      }
      res.status(200).json({ success: true, data: bootcamp })
   }catch(err){
      res.status(400).json({ success: false, })
   }
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
exports.updateBootCamp = async (req, res, next) => {
   try{
      const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
         new:true, //get the updated the data
         runValidators:true // mongoose validators
      })
      if(!bootcamp){
         return res.status(400).json({ success: false, })
      }
      res.status(200).json({ success: true, data: bootcamp })
   }catch(err){
      res.status(400).json({ success: false, })
   }
}


/*
 * @route : DELETE /api/v1/bootcamps/:id
 * @desc : delete bootcamp
 * @access : Private
*/
exports.deleteBootCamp = async (req, res, next) => {
   try{
      const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
      if(!bootcamp){
         return res.status(400).json({ success: false, })
      }
      res.status(200).json({ success: true, data: {}, count:bootcamp.length })
   }catch(err){
      res.status(400).json({ success: false, })
   }
}