const { logger } = require('api/logger')

module.exports = (app) => {
  app.io.on('connect', (socket) => {
    // console.log(socket.request.headers)
    logger({ level: 3, message: `Socket IO connected, ${socket.id}` })

    socket.on('disconnect', () => {
      logger({ level: 4, message: `Socket IO disconnect, ${socket.id}` })
    })

    socket.on('devicesConnect', () => {
      socket.join('devices')
    })

    socket.on('devicesDisconnect', () => {
      socket.leave('devices')
    })
  })

  app.io.of('/').adapter.on('create-room', (room) => {
    console.log(`room ${room} was created`)
  })

  app.io.of('/').adapter.on('join-room', (room, id) => {
    console.log(`socket ${id} has joined room ${room}`)
  })

  app.io.of('/').adapter.on('leave-room', (room, id) => {
    console.log(`socket ${id} has leave room ${room}`)
  })

  logger({ level: 3, message: `Socket IO Listening` })
}
