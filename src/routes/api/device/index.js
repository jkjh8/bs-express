const express = require('express')
const router = express.Router()
const { logger } = require('api/logger')
const { client } = require('db/redis')
const Devices = require('db/models/devices')
// const fnDevice = require('api/device')
const { getDevices, getDevice } = require('api/device')

router.get('/exists', async (req, res) => {
  try {
    const r = await Devices.exists({ index: req.query.index })
    return res.json({ result: r })
  } catch (err) {
    logger({
      level: 5,
      id: req.user.email,
      message: `디바이스 인덱스 검증 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.get('/ipexists', async (req, res) => {
  try {
    const r = await Devices.exists({ ipaddress: req.query.ipaddr })
    return res.json({ result: r })
  } catch (err) {
    logger({
      level: 5,
      id: req.user.email,
      message: `디바이스 IP검증 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.get('/', async (req, res) => {
  try {
    const r = await Devices.find({})
    res.json(r)
  } catch (err) {
    logger({
      level: 5,
      id: req.user.email,
      message: `디바이스 리스트 호출 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.post('/', async (req, res) => {
  try {
    console.log(req.user)
    const device = new Devices({
      ...req.body
    }).save()
    await getDevice(req.body)
    logger({
      level: 0,
      id: req.user.email,
      message: `디바이스 추가 Name: ${req.body.name} IPaddress: ${req.body.ipaddress}`
    })
    res.json({ result: 'ok' })
  } catch (err) {
    logger({
      level: 2,
      id: req.user.email,
      message: `디바이스 추가 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.put('/', async (req, res) => {
  try {
    const r = await Devices.findOneAndUpdate({ _id: req.body._id }, req.body)
    await getDevice(req.body)
    logger({
      level: 0,
      id: req.user.email,
      message: `디바이스 수정 Name: ${req.body.name} IPaddress: ${req.body.ipaddress}`
    })
    res.json({ result: r })
  } catch (err) {
    logger({
      level: 2,
      id: req.user.email,
      message: `디바이스 수정 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.get('/delete', async (req, res) => {
  try {
    await Devices.deleteOne({ _id: req.query.id })
    logger({
      level: 0,
      id: req.user.email,
      message: `디바이스 삭제 Name: ${req.query.name} IPaddress: ${req.query.ipaddress}`
    })
    res.send('OK')
  } catch (err) {
    logger({
      level: 2,
      id: req.user.email,
      message: `디바이스 삭제 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.get('/getstatusinfo', async (req, res) => {
  try {
    res.json(JSON.parse(await client.get(`status:${req.query.ipaddress}`)))
  } catch (err) {
    logger({
      level: 5,
      id: req.user.email,
      message: `디바이스 정보 호출 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.post('/refresh', async (req, res) => {
  try {
    await getDevice(req.body)
    res.send('OK')
  } catch (err) {
    logger({
      level: 5,
      id: req.user.email,
      message: `디바이스 갱신 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.get('/refreshall', async (req, res) => {
  try {
    await getDevices()
    res.send('OK')
  } catch (err) {
    logger({
      level: 5,
      id: req.user.email,
      message: `디바이스 전체갱신 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

module.exports = router
