import express from 'express'
const router = express.Router()
// const { loggerArr } = require('api/logger')
// const Zones = require('db/models/zones')
// const { qsysSetTx } = require('api/device/qsys')

import { loggedIn } from '@/api/users/loggedIn'
import {
  getZones,
  addZone,
  editZone,
  checkIndex,
  checkCore,
  deleteZone
} from '@/api/zones'

router.get('/', loggedIn, getZones)
router.post('/', loggedIn, addZone)
router.put('/', loggedIn, editZone)
router.delete('/:value', loggedIn, deleteZone)

// exists
router.get('/idxexists/:value', loggedIn, checkIndex)
router.get('/coreexists/:value', loggedIn, checkCore)

router.get('/existChildren', async (req, res) => {
  try {
    return res.json({
      result: await Zones.find({
        children: { $elemMatch: { $eq: req.query.id } }
      })
    })
  } catch (err) {
    loggerArr(5, req.user, `방송구간 중복 확인 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.put('/addchildrens', async (req, res) => {
  try {
    const targetAddresses = await qsysSetTx(req.body)
    loggerArr(
      0,
      req.user,
      `방송구간 ${
        req.body.core.ipaddress
      } 채널이 변경되었습니다. ${targetAddresses.join(',')}`
    )
    return res.json({
      result: await Zones.updateOne(
        { _id: req.body._id },
        { $set: { children: req.body.children } }
      )
    })
  } catch (err) {
    loggerArr(5, req.user, `방송구간 지역 추가 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

module.exports = router
