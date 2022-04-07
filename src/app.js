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

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'development' ? err : {}

//   // render the error page
//   res.status(err.status || 500)
//   res.render('error')
// })
console.log(process.env.DB_USER, process.env.DB_PASS)

module.exports = app
