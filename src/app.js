/** @format */

require('app-module-path').addPath(__dirname)
const path = require('path')
const logger = require('./logger')

// const createError = require('http-errors')
const httpLogger = require('morgan')
const cors = require('cors')
const express = require('express')
const { Server } = require('socket.io')

const cookieParser = require('cookie-parser')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const passport = require('passport')

// connect db
const { sessionClient } = require('db/redis')
require('db/mongodb')

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
  store: new RedisStore({ client: sessionClient })
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

const { getDevices } = require('./api/device')
getDevices()

module.exports = app
