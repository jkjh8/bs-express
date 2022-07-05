const express = require('express')
const router = express.Router()
const { loggerArr } = require('api/logger')
const redis = require('db/redis')
const Devices = require('db/models/devices')
// const fnDevice = require('api/device')
const { getDevices, getDevice } = require('api/device')

router.get('/', async (req, res) => {
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
    loggerArr(
      0,
      req.user,
      `디바이스 추가 Name: ${req.body.name} IPaddress: ${req.body.ipaddress}`
    )
    return res.json({ result: 'OK' })
  } catch (err) {
    loggerArr(5, req.user, `디바이스 추가 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.put('/', async (req, res) => {
  try {
    await Devices.findOneAndUpdate({ _id: req.body._id }, req.body)
    // await getDevice(req.body)
    loggerArr(
      0,
      req.user,
      `디바이스 수정 Name: ${req.body.name} IPaddress: ${req.body.ipaddress}`
    )
    res.json({ result: 'OK' })
  } catch (err) {
    loggerArr(5, req.user, `디바이스 수정 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/exists', async (req, res) => {
  try {
    return res.json({
      result: await Devices.exists({ index: req.query.index })
    })
  } catch (err) {
    loggerArr(5, req.user, `디바이스 검증 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/ipexists', async (req, res) => {
  try {
    return res.json({
      result: await Devices.exists({ ipaddress: req.query.ipaddr })
    })
  } catch (err) {
    loggerArr(5, req.user, `디바이스 IP 검증 오류 ${err}`)
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
    const item = JSON.parse(req.query.item)
    await Devices.deleteOne({ _id: item._id })

    loggerArr(
      0,
      req.user,
      `디바이스 삭제 Name: ${item.name} IPaddress: ${item.ipaddress}`
    )
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
