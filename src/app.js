/** @format */

require('app-module-path').addPath(__dirname)
const path = require('path')
const { logger } = require('api/logger')

// const createError = require('http-errors')
const httpLogger = require('morgan')
const cors = require('cors')
const express = require('express')
const { Server } = require('socket.io')

const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')

// connect db
const mongoose = require('db/mongodb')

// init app
const app = express()
app.io = new Server()
require('./socketio')(app)

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
const sessionOptions = session({
  secret: process.env.SESSION_PASS,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 3600000)
  },
  store: MongoStore.create({
    mongoUrl: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@mongodb:27017/bs`
  })
})
app.use(sessionOptions)

// passport
require('api/passport')()
app.use(passport.initialize())
app.use(passport.session())

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next)

app.io.use(wrap(sessionOptions))
app.io.use(wrap(passport.initialize()))
app.io.use(wrap(passport.session()))
app.io.use((socket, next) => {
  if (socket.request.user) {
    next()
  } else {
    next(new Error('unauthorized'))
  }
})

app.use('/', require('./routes'))
app.use('/api', require('./routes/api'))

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404))
// })

const { startTimeline } = require('./api/device')
startTimeline()

global.app = app
module.exports = app
