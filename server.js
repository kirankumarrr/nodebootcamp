const express = require('express')
const dotenv = require('dotenv')

//Routes
const bootcamps = require('./routes/bootcamps')

//Load env var's
dotenv.config({ path: './config/config.env' })

const app = express();

//Mount routers
app.use('/api/v1/bootcamps',bootcamps)




const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`Server runnig in ${process.env.NODE_EVN} mode on port ${PORT}`)
)