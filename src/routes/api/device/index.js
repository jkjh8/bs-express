const express = require('express')
const router = express.Router()
const { loggerArr } = require('api/logger')
const redis = require('db/redis')
const Devices = require('db/models/devices')
// const fnDevice = require('api/device')

const { loggedIn } = require('api/users/loggedIn')
const {
  getDevices,
  addDevice,
  editDevice,
  deleteDevice,
  checkIndex,
  checkIpaddress
} = require('api/device')
const {
  getDeviceStatus,
  getPaStatus,
  getStatusDetail
} = require('api/device/devicesR')

// default functions
router.get('/', loggedIn, getDevices)
router.post('/', loggedIn, addDevice)
router.put('/', loggedIn, editDevice)
router.get('/delete', loggedIn, deleteDevice)

// check exists functions
router.get('/idxexists', loggedIn, checkIndex)
router.get('/ipexists', loggedIn, checkIpaddress)

// get status from redis
router.get('/status', loggedIn, getDeviceStatus)
router.get('/pa', loggedIn, getPaStatus)
router.get('/getDetail', loggedIn, getStatusDetail)

// 외부 모델로 전환 필요
router.post('/refresh', async (req, res) => {
  try {
    return res.json(await getDevice(req.body))
  } catch (err) {
    loggerArr(5, req.user, `디바이스 갱신 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/refreshall', async (req, res) => {
  try {
    return res.json(await getDevices())
  } catch (err) {
    loggerArr(5, req.user, `디바이스 전체 갱신 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

module.exports = router
