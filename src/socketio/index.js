import { loggerArr as log } from '@/api/logger'
import Devices from '@/db/models/devices'

export default function (io) {
  io.on('connect', (socket) => {
    if (socket.handshake.query.type) {
      switch (socket.handshake.query.type) {
        case 'device':
          socket.join('devices')
          log(3, 'Server', `Socket IO connected mode Devices, ${socket.id}`)
          // socket.on('devices', async (command) => {
          //   fnDevices(socket, command)
          // })
          break
        case 'client':
          socket.join('clients')
          log(3, 'Server', `Socket IO connected mode Clients, ${socket.id}`)
      }
    }

    socket.on('disconnect', () => {
      log(4, 'Server', `Socket IO disconnected, ${socket.id}`)
    })

    socket.on('PA', (args) => {
      io.of('clients').emit('PA', args)
    })
  })

  log(3, 'Server', `Socket IO Listening`)
}

export function sendSocketDevices(namespace, args) {
  io.of('devices').emit(namespace, args)
}

export function sendSocketClients(namespace, args) {
  io.of('clients').emit(namespace, args)
}
