const express = require('express')
const router = express.Router()
const logger = require('logger')
const eventlog = require('api/eventlog')
const { client } = require('db/redis')
const Devices = require('db/models/devices')
// const fnDevice = require('api/device')
const { getDevices, getDevice } = require('api/device')

router.get('/exists', async (req, res) => {
  try {
    const r = await Devices.exists({ index: req.query.index })
    return res.json({ result: r })
  } catch (err) {
    logger.error(`디바이스 인덱스 검증 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

router.get('/ipexists', async (req, res) => {
  try {
    const r = await Devices.exists({ ipaddress: req.query.ipaddr })
    return res.json({ result: r })
  } catch (err) {
    logger.error(`디바이스 아이피 검증 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

router.get('/', async (req, res) => {
  try {
    const r = await Devices.find({})
    res.json(r)
  } catch (err) {
    logger.error(`디바이스 리스트 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

router.post('/', async (req, res) => {
  try {
    console.log(req.user)
    const device = new Devices({
      ...req.body
    }).save()
    logger.info(`디바이스 추가 ${JSON.stringify(req.body)}`)
    eventlog.info({
      id: req.user.email,
      message: `디바이스 추가 IP: ${req.body.ipaddress} Type: ${req.body.deviceType} Name: ${req.body.name}`
    })
    res.json({ result: 'ok' })
  } catch (err) {
    logger.error(`디바이스 추가 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

router.put('/', async (req, res) => {
  try {
    const r = await Devices.findOneAndUpdate({ _id: req.body._id }, req.body)
    logger.info(`디바이스 수정 ${JSON.stringify(req.body)}`)
    eventlog.info({
      id: req.user.email,
      message: `디바이스 수정 IP: ${req.body.ipaddress} Type: ${req.body.deviceType} Name: ${req.body.name}`
    })
    res.json({ result: r })
  } catch (err) {
    logger.error(`디바이스 수정 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

router.get('/delete', async (req, res) => {
  try {
    await Devices.deleteOne({ _id: req.query.id })
    logger.info(`디바이스 삭제 ${JSON.stringify(req.query)}`)
    eventlog.info({
      id: req.user.email,
      message: `디바이스 삭제 ID: ${req.query.id}`
    })
    res.send('OK')
  } catch (err) {
    logger.error(`디바이스 삭제 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

router.get('/getstatusinfo', async (req, res) => {
  try {
    res.json(JSON.parse(await client.get(`status:${req.query.ipaddress}`)))
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

router.post('/refresh', async (req, res) => {
  try {
    await getDevice(req.body)
    res.send('OK')
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

router.get('/refreshall', async (req, res) => {
  try {
    await getDevices()
    res.send('OK')
  } catch (err) {
    res.status(500).json({ error: err })
  }
})

module.exports = router
