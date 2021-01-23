const path = require('path');
const express = require('express');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const expressMongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const errorHandler = require('./middelware/error');

// const logger =require('./middelware/logger')
const morgan = require('morgan');
//Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
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

//Enable CROS
app.use(cors());

//Set Security headers
app.use(helmet());

//Prevent adding duplicate values in array params
// http param pollution
app.use(hpp());

//Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10mins
  max: 100,
});
app.use(limiter);

//Prevent XSS events
app.use(xssClean());

//Sanitize data
app.use(expressMongoSanitize());

//File Uploading
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

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
