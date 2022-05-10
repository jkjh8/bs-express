const Devices = require('db/models/devices')
const { sendMsgToQSys, qsysGetStatus, qsysGetPa } = require('./qsys')
const { getBarixInfo } = require('./barix')

let dataTimeline

module.exports.qsysRefresh = (device) => {
  qsysGetStatus(device)
  qsysGetPa(device)
}

async function getDevices() {
    try {
      const devices = await Devices.find({})
      for (let i = 0; i < devices.length; i++) {
        switch (devices[i].deviceType) {
          case 'Q-Sys':
            if (devices[i].mode !== 'Local') {
              qsysGetPa(devices[i])
              qsysGetStatus(devices[i])
            }
            break
          case 'Barix':
            getBarixInfo(devices[i].ipaddress)
            break
        }
      }
    } catch (err) {
      logger({
      level: 5,
      message: `Device Status Error: ${JSON.stringify(err)}`
    })
    }
}

module.exports.getDevices = getDevices

module.exports.getDevice = async (device) => {
    try {
      switch (device.deviceType) {
        case 'Q-Sys':
          if (device.mode !== 'Local') {
            qsysGetPa(device)
            qsysGetStatus(device)
          }
          break
        case 'Barix':
          getBarixInfo(device.ipaddress)
          break
      }
      resolve()
    } catch (err) {
      logger({
      level: 5,
      message: `Device Status Error: ${JSON.stringify(err)}`
    })
    }
}

module.exports.startTimeline = () => {
  dataTimeline = setInterval(async () => {
    console.log('Get')
    await getDevices()
  }, 55000)
}

module.exports.clearTimeline = () => {
  clearInterval(dataTimeline)
}
