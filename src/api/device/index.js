const Devices = require('db/models/devices')
const logger = require('logger')
const { sendMsgToQSys, qsysGetStatus, qsysGetPa } = require('./qsys')
const { getBarixInfo } = require('./barix')

let dataTimeline

module.exports.qsysRefresh = (device) => {
  qsysGetStatus(device)
  qsysGetPa(device)
}

function getDevices() {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => {
      reject('Timeout')
    }, 5000)
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
        }
      }
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
module.exports.getDevices = getDevices

module.exports.getDevice = (device) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timeout')
    }, 5000)
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
      }
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

module.exports.startTimeline = () => {
  dataTimeline = setInterval(async () => {
    await getDevices()
  }, 55000)
}

module.exports.clearTimeline = () => {
  clearInterval(dataTimeline)
}
