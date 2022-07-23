const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const  controllers = require('./controllers')
const timeout = require('connect-timeout') //express v4
require('dotenv').config()

const connectDB = require('./database/mongo/mongodb')
connectDB()

const app = express();

const haltOnTimedout = (req, res, next) => {
  if (!req.timedout) {
      next();
  }
}

app.use(timeout(120000))
app.use(haltOnTimedout)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.use('/', controllers.loginController)
app.use('/notes', controllers.noteController)

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is listening on port: ${process.env.PORT || 4000}`)
})