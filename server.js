const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDB = require('./config/db')
const errorHandler = require('./middelware/error')

// const logger =require('./middelware/logger')
const morgan  = require('morgan')
//Routes
const bootcamps = require('./routes/bootcamps')
const { Server } = require('http')

//Load env var's
dotenv.config({ path: './config/config.env' })

//Connect to database
connectDB()

const app = express();

//Body parser
app.use(express.json())

//Dev logging middleware
if(process.env.NODE_EVN==='development'){
  app.use(morgan('dev'))
}



//Mount routers
app.use('/api/v1/bootcamps',bootcamps)

//Note : make sure it shoulb be always below the route
// app.use(logger)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(`Server runnig in ${process.env.NODE_EVN} mode on port ${PORT}`.yellow.underline.bold)
)

//Handle unhandled promises rejections
process.on('unhandledRejection',(error,promise)=>{
  console.log(`Error: ${error.message}`.red)
  //Close server and exist the process
  //exit:(1)  : Means exit with one failure
  server.close(()=>process.exit(1))
})