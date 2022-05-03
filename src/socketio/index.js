const logger = require('logger')

module.exports = (app) => {
  app.io.on('connect', (socket) => {
    // console.log(socket.request.headers)
    logger.info(`Socket IO connected, ${socket.id}`)

    socket.on('disconnect', () => {
      logger.warn(`Socket IO disconnect, ${socket.id}`)
    })

    socket.on('devicesConnect', () => {
      socket.join('devices')
    })

    socket.on('devicesDisconnect', () => {
      socket.leave('devices')
    })
  })

  app.io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`)
  })
  
  app.io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`)
  })

  app.io.of("/").adapter.on("leave-room", (room, id) => {
    console.log(`socket ${id} has leave room ${room}`)
  })

  logger.info('Socket IO Listening...')
}
