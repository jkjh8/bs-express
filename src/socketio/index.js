const { loggerArr } = require('api/logger')

module.exports = () => {
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

    socket.on('devicesConnect', () => {
      socket.join('devices')
    })

    socket.on('devicesDisconnect', () => {
      socket.leave('devices')
    })

    socket.on('PA', (args) => {
      io.of('clients').emit('PA', args)
    })
  })

  io.of('/').adapter.on('create-room', (room) => {
    console.log(`room ${room} was created`)
  })

  io.of('/').adapter.on('join-room', (room, id) => {
    console.log(`socket ${id} has joined room ${room}`)
  })

  io.of('/').adapter.on('leave-room', (room, id) => {
    console.log(`socket ${id} has leave room ${room}`)
  })

  loggerArr(3, 'Server', `Socket IO Listening`)
}
