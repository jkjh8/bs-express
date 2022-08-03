const express = require('express')
const router = express.Router()
const { loggerArr } = require('api/logger')
const redis = require('db/redis')
const Devices = require('db/models/devices')
// const fnDevice = require('api/device')
const { getDevices, getDevice } = require('api/device')
const { loggedIn } = require('api/users/loggedIn')

router.get('/', loggedIn, async (req, res) => {
  try {
    return res.json(await Devices.find({}).sort({ index: 1 }))
  } catch (err) {
    loggerArr(5, req.user, `디바이스 리스트 호출 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.post('/', async (req, res) => {
  try {
    await new Devices({ ...req.body }).save()
    // await getDevice(req.body)
    loggerArr(0, req.user, `디바이스 추가: ${JSON.stringify(req.body)}`)
    return res.json({ result: 'OK' })
  } catch (err) {
    loggerArr(5, req.user, `디바이스 추가 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.put('/', async (req, res) => {
  try {
    await Devices.findOneAndUpdate({ _id: req.body._id }, req.body)
    loggerArr(0, req.user, `디바이스 수정: ${JSON.stringify(req.body)}`)
    res.status(200).send('OK')
  } catch (err) {
    loggerArr(5, req.user, `디바이스 수정 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/idxexists', async (req, res) => {
  try {
    const { index, id } = req.query
    return res.json({
      result: await Devices.exists({
        $and: [{ index: index }, { _id: { $ne: id } }]
      })
    })
  } catch (err) {
    loggerArr(5, req.user, `디바이스 인덱스 중복 검증 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/ipexists', async (req, res) => {
  try {
    const { ipaddress, id } = req.query
    return res.json({
      result: await Devices.exists({
        $and: [{ ipaddress: ipaddress }, { _id: { $ne: id } }]
      })
    })
  } catch (err) {
    loggerArr(5, req.user, `디바이스 IP 중복 검증 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/status', async (req, res) => {
  try {
    return res.json(await redis.HGETALL('status'))
  } catch (err) {
    loggerArr(5, req.user, `디바이스 상태 수집 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/pa', async (req, res) => {
  try {
    return res.json(await redis.HGETALL('pa'))
  } catch (err) {
    loggerArr(5, req.user, `디바이스 PA 모듈 수집 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/delete', async (req, res) => {
  try {
    const { user } = req
    const { item } = req.query
    const obj = JSON.parse(item)
    await Devices.deleteOne({ _id: obj._id })
    loggerArr(0, user, `디바이스 삭제: ${item}`)
    return res.sendStatus(200)
  } catch (err) {
    loggerArr(2, req.user, `디바이스 삭제 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/getstatusinfo', async (req, res) => {
  try {
    return res.json(
      JSON.parse(await redis.get(`status:${req.query.ipaddress}`))
    )
  } catch (err) {
    loggerArr(5, req.user, `디바이스 정보 호출 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

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
