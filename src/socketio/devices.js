import Devices from '@/db/models/devices'

export default async function (socket, command) {
  switch (command) {
    case 'get':
      socket.emit('devices', await Devices.find({}).sort({ index: 1 }))
      break
    case 'getQsys':
      socket.emit(
        'devices',
        await Devices.find({ deviceType: 'Q-Sys', mode: 'Core' }).sort({
          index: 1
        })
      )
      break
  }
}
