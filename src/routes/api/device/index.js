import express from 'express'
const router = express.Router()

import { loggedIn } from '@/api/users/loggedIn'
import {
  getDevices,
  addDevice,
  editDevice,
  deleteDevice,
  checkIndex,
  checkIpaddress
} from '@/api/device'
import {
  getDeviceStatus,
  getPaStatus,
  getStatusDetail
} from '@/api/device/devicesR'

// default functions
router.get('/', loggedIn, getDevices)
router.post('/', loggedIn, addDevice)
router.put('/', loggedIn, editDevice)
router.delete('/:value', loggedIn, deleteDevice)

// check exists functions
router.get('/idxexists/:value', loggedIn, checkIndex)
router.get('/ipexists/:value', loggedIn, checkIpaddress)

// get status from redis
router.get('/status', loggedIn, getDeviceStatus)
router.get('/pa', loggedIn, getPaStatus)
router.get('/getDetail', loggedIn, getStatusDetail)

// for settop
router.get('/qcontrol', getDevices)

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

export default router
