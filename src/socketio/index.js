const logger = require('logger')

module.exports = (app) => {
  app.io.on('connect', (socket) => {
    // console.log(socket.request.headers)
    logger.info(`Socket IO connected, ${socket.id}`)

    socket.on('disconnect', () => {
      logger.warn(`Socket IO disconnect, ${socket.id}`)
    })
  })

  logger.info('Socket IO Listening...')
}
