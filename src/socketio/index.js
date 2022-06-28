const { loggerArr } = require('api/logger')
const Devices = require('db/models/devices')

module.exports = (io) => {
  io.on('connect', (socket) => {
    if (socket.handshake.query.type) {
      switch (socket.handshake.query.type) {
        case 'device':
          socket.join('devices')
          loggerArr(
            3,
            'Server',
            `Socket IO connected mode Devices, ${socket.id}`
          )
          // socket.on('devices', async (command) => {
          //   fnDevices(socket, command)
          // })
          break
        case 'client':
          socket.join('clients')
          loggerArr(
            3,
            'Server',
            `Socket IO connected mode Clients, ${socket.id}`
          )
      }
    }

    socket.on('disconnect', () => {
      loggerArr(4, 'Server', `Socket IO disconnected, ${socket.id}`)
    })

    socket.on('PA', (args) => {
      io.of('clients').emit('PA', args)
    })
  })

  loggerArr(3, 'Server', `Socket IO Listening`)
}

module.exports.sendSocketDevices = (namespace, args) => {
  io.of('devices').emit(namespace, args)
}

module.exports.sendSocketClients = (namespace, args) => {
  io.of('clients').emit(namespace, args)
}
