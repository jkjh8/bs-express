#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js'
import { loggerArr as log } from '../api/logger'
import http from 'http'

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

// socket io attach
// io.attach(server, {
//   origin: function (origin, callback) {
//     callback(null, origin)
//   },
//   credentials: true
// })
log(3, 'Server', 'Socket IO Attach Server')
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log(5, 'Server', `${bind} requires elevated privileges`)
      process.exit(1)
    case 'EADDRINUSE':
      log(5, 'Server', `${bind} is already in use`)
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  log(4, 'Server', `Listening on ${bind}`)
}
