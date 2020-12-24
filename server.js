const express = require('express')
const dotenv = require('dotenv')

//Load env var's
dotenv.config({ path: './config/config.env' })

const app = express()

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`Server runnig in ${process.env.NODE_EVN} mode on port ${PORT}`)
)