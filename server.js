const path = require('path');
const express = require('express');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middelware/error');

// const logger =require('./middelware/logger')
const morgan = require('morgan');
//Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const { Server } = require('http');

//Load env var's
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_EVN === 'development') {
  app.use(morgan('dev'));
}

//File Uploading
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

//Note : make sure it shoulb be always below the route
// app.use(logger)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server runnig in ${process.env.NODE_EVN} mode on port ${PORT}`.yellow
      .underline.bold
  )
);

//Handle unhandled promises rejections
process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`.red);
  //Close server and exist the process
  //exit:(1)  : Means exit with one failure
  server.close(() => process.exit(1));
});
