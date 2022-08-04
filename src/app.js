/** @format */
import path from 'node:path'
// import history from 'connect-history-api-fallback'

// const createError = require('http-errors')
import httpLogger from 'morgan'
import cors from 'cors'
import express from 'express'
import { Server } from 'socket.io'

import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import MongoStore from 'connect-mongo'

// connect db
import mongoose from './db/mongodb'

// routes
import routes from './routes'
import apiRoutes from './routes/api'

// init app
const app = express()
global.io = new Server()
import socket from '@/socketio'
socket(io)

// cors
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin)
    },
    credentials: true
  })
)

// etc plugins
app.use(httpLogger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// init session
const sessionOptions = session({
  secret: process.env.SESSION_PASS,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  },
  store: MongoStore.create({
    mongoUrl: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@mongodb:27017/bs`
  })
})
app.use(sessionOptions)

// passport
import initPassport from '@/api/users/passport'
initPassport()
app.use(passport.initialize())
app.use(passport.session())

// session socket io
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next)

io.use(wrap(sessionOptions))
io.use(wrap(passport.initialize()))
io.use(wrap(passport.session()))
io.use((socket, next) => {
  if (socket.handshake.query.type === 'device') {
    return next()
  }
  if (socket.request.user) {
    next()
  } else {
    next(new Error('unauthorized'))
  }
})

// init routes
// app.use(history())
app.use('/', routes)
app.use('/api', apiRoutes)
app.use(express.static(path.join(__dirname, 'public', 'spa')))

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404))
// })

// const { startTimeline } = require('./api/device')
// startTimeline()

export default app
