/** @format */

require('app-module-path').addPath(__dirname)
const path = require('path')
const logger = require('./config/logger')

// const createError = require('http-errors')
const httpLogger = require('morgan')
const cors = require('cors')
const express = require('express')

const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const RedisStore = require('connect-redis')(session)
const passport = require('passport')

// connect db
const client = require('db/redis')
require('db/mongodb')

// init app
const app = express()

// cors
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin)
    },
    credentials: true
  })
)
app.use(httpLogger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// init session
app.use(
  session({
    secret: process.env.SESSION_PASS,
    resave: true,
    saveUninitialized: true,
    store: new RedisStore({ client })
  })
)

// passport
require('api/passport')()
app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes'))
app.use('/api', require('./routes/api'))

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404))
// })

module.exports = app
