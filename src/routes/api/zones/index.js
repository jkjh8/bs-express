const express = require('express')
const router = express.Router()
const logger = require('logger')
const Zones = require('db/models/zones')
const eventlog = require('api/eventlog')

router.get('/exists', async (req, res) => {
  try {
    const r = await Zones.exists({ index: req.query.index })
    return res.json({ result: r })
  } catch (err) {
    logger.error(`방송구간 인덱스 검증 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

router.get('/', async (req, res) => {
  try {
    const r = await Zones.find({}).populate('core').populate('children')
    res.json(r)
  } catch (err) {
    logger.error(`방송구간 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

router.post('/', async (req, res) => {
  try {
    const zone = new Zones({
      ...req.body
    }).save()
    logger.info(`방송구간 추가 ${JSON.stringify(req.body)}`)
    eventlog.info({
      id: req.user.email,
      message: `방송구간 추가 Name: ${req.body.name} Core: ${req.body.core}`
    })
    res.json({ result: 'ok' })
  } catch (err) {
    logger.error(`방송구간 추가 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

router.put('/', async (req, res) => {
  try {
    const r = await Zones.findOneAndUpdate({ _id: req.body._id }, req.body)
    logger.info(`방송구간 수정 ${JSON.stringify(req.body)}`)
    eventlog.info({
      id: req.user.email,
      message: `방송구간 수정 Name: ${req.body.name} Core: ${req.body.core}`
    })
    res.json({ result: 'ok' })
  } catch (err) {
    logger.error(`방송구간 수정 오류 ${err}`)
  }
})

router.get('/delete', async (req, res) => {
  try {
    await Zones.deleteOne({ _id: req.query.id })
    logger.info(`방송구간 삭제 ${JSON.stringify(req.query)}`)
    eventlog.info({
      id: req.user.email,
      message: `방송구간 삭제 ID: ${req.query.id}`
    })
  } catch (err) {
    logger.error(`방송구간 삭제 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

module.exports = router
