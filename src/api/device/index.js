const Devices = require('db/models/devices')
const logger = require('logger')
const { sendMsgToQSys, qsysGetStatus, qsysGetPa } = require('./qsys')
const { getBarixInfo } = require('./barix')

module.exports.qsysRefresh = (device) => {
  qsysGetStatus(device)
  qsysGetPa(device)
}

module.exports.getDevices = () => {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => {
      reject('Timeout')
    }, 5000)
    try {
      const devices = await Devices.find({})
      for (let i = 0; i < devices.length; i++) {
        switch (devices[i].deviceType) {
          case 'Q-Sys':
            qsysGetPa(devices[i])
            qsysGetStatus(devices[i])
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

module.exports.getDevice = (device) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timeout')
    }, 5000)
    try {
      switch (device.deviceType) {
        case 'Q-Sys':
          qsysGetPa(device)
          qsysGetStatus(device)
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
