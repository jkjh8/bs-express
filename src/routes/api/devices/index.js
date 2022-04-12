const express = require('express')
const router = express.Router()
const logger = require('logger')
// const redis = require('db/redis')
const Devices = require('db/models/devices')

router.get('/exists', async (req, res) => {
  try {
    const r = await Devices.exists({ index: req.query.index })
    console.log(r)
    return res.json({ result: r })
  } catch (err) {
    logger.error(`디바이스 인덱스 검증 오류 ${err}`)
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
    const device = new Devices({
      ...req.body
    }).save()
    res.json({ result: 'ok' })
  } catch (err) {
    logger.error(`디바이스 추가 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

module.exports = router
