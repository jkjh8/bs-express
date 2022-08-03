const Devices = require('db/models/devices')
const redis = require('db/redis')
const { loggerArr: log } = require('api/logger')
const { objTokv } = require('api/functions')

const { loggedIn } = require('api/users/loggedIn')

module.exports.getDevices = async (req, res) => {
  try {
    return res.status(200).json(await Devices.find({}).sort({ index: 1 }))
  } catch (err) {
    log(5, req.user, `디바이스리스트오류: ${err}`)
    return res.status(500).json(err)
  }
}

module.exports.addDevice = async (req, res) => {
  try {
    const device = new Devices({ ...req.body })
    const r = await device.save()
    log(3, req.user, `디바이스추가: ${await objTokv(req.body)}`)
    return res.status(200).json(r)
  } catch (err) {
    log(5, req.user, `디바이스추가오류: ${err}`)
    return res.status(500).json(err)
  }
}

module.exports.editDevice = async (req, res) => {
  try {
    const r = await Devices.findOneAndUpdate({ _id: req.body._id }, req.body)
    log(3, req.user, `디바이스수정: ${objTokv(req.body)}`)
    res.status(200).json(r)
  } catch (err) {
    log(5, req.user, `디바이스수정오류: ${err}`)
    return res.status(500).json(err)
  }
}

module.exports.deleteDevice = async (req, res) => {
  try {
    const item = JSON.parse(req.query.item)
    const r = await Devices.deleteOne({ _id: item._id })
    log(3, req.user, `디바이스삭제: ${objTokv(item)}`)
    return res.status(200).json(r)
  } catch (err) {
    log(5, req.user, `디바이스삭제오류: ${err}`)
    return res.status(500).json(err)
  }
}

module.exports.checkIndex = async (req, res) => {
  try {
    const { index, id } = req.query
    return res.status(200).json({
      result: await Devices.exists({
        $and: [{ index: index }, { _id: { $ne: id } }]
      })
    })
  } catch (err) {
    log(5, req.user, `디바이스인덱스확인오류: ${err}`)
    res.status(500).json(err)
  }
}

module.exports.checkIpaddress = async (req, res) => {
  try {
    const { ipaddress, id } = req.query
    return res.status(200).json({
      result: await Devices.exists({
        $and: [{ ipaddress: ipaddress }, { _id: { $ne: id } }]
      })
    })
  } catch (err) {
    log(5, req.user, `디바이스아이피확인오류: ${err}`)
    res.status(500).json(err)
  }
}

// const { sendMsgToQSys, qsysGetStatus, qsysGetPa } = require('./qsys')
// const { getBarixInfo } = require('./barix')

// let dataTimeline

// module.exports.qsysRefresh = (device) => {
//   qsysGetStatus(device)
//   qsysGetPa(device)
// }

// async function getDevices() {
//   try {
//     const devices = await Devices.find({})
//     for (let i = 0; i < devices.length; i++) {
//       switch (devices[i].deviceType) {
//         case 'Q-Sys':
//           if (devices[i].mode !== 'Local') {
//             qsysGetPa(devices[i])
//             qsysGetStatus(devices[i])
//           }
//           break
//         case 'Barix':
//           getBarixInfo(devices[i].ipaddress)
//           break
//       }
//     }
//   } catch (err) {
//     throw err
//   }
// }

// module.exports.getDevices = getDevices

// module.exports.getDevice = async (device) => {
//   try {
//     switch (device.deviceType) {
//       case 'Q-Sys':
//         if (device.mode !== 'Local') {
//           qsysGetPa(device)
//           qsysGetStatus(device)
//         }
//         break
//       case 'Barix':
//         getBarixInfo(device.ipaddress)
//         break
//     }
//     resolve()
//   } catch (err) {
//     throw err
//   }
// }

// module.exports.startTimeline = () => {
//   dataTimeline = setInterval(async () => {
//     await getDevices()
//   }, 55000)
// }

// module.exports.clearTimeline = () => {
//   clearInterval(dataTimeline)
// }
