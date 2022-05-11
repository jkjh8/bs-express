const express = require('express')
const router = express.Router()
const { logger } = require('api/logger')
const Zones = require('db/models/zones')

router.get('/exists', async (req, res) => {
  let user = ''
  if (req.user && req.user.email) {
    user = req.user.email
  }

  try {
    const r = await Zones.exists({ index: req.query.index })
    return res.json({ result: r })
  } catch (err) {
    logger({
      level: 5,
      id: user,
      message: `방송구간 인덱스 검증 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.get('/existsChildren', async (req, res) => {
  let user = ''
  if (req.user && req.user.email) {
    user = req.user.email
  }

  try {
    const r = await Zones.find({ children: {$elemMatch: {$eq: req.query.id}} })
    return res.json({ result: r})
  } catch (error) {
    console.log(error)
    logger({
      level: 5,
      id: user,
      message: `방송구간 중복 확인 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.get('/', async (req, res) => {
  let user = ''
  if (req.user && req.user.email) {
    user = req.user.email
  }

  try {
    const r = await Zones.find({}).populate('core').populate({path: 'children', options: { retainNullValues: true}})
    res.json(r)
  } catch (err) {
    logger({
      level: 5,
      id: user,
      message: `방송구간 호출 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.post('/', async (req, res) => {
  let user = ''
  if (req.user && req.user.email) {
    user = req.user.email
  }

  try {
    const zone = new Zones({
      ...req.body
    }).save()
    logger({
      level: 0,
      id: req.user.email,
      message: `방송구간 추가 Name: ${req.body.name} Core: ${req.body.core.ipaddress}`
    })
    res.json({ result: 'ok' })
  } catch (err) {
    logger({
      level: 5,
      id: req.user && req.user.email ? req.user.email : '',
      message: `방송구간 추가 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.put('/', async (req, res) => {
  try {
    const r = await Zones.findOneAndUpdate({ _id: req.body._id }, req.body)
    logger({
      level: 0,
      id: req.user && req.user.email ? req.user.email : '',
      message: `방송구간 수정 Name: ${req.body.name} Core: ${req.body.core.ipaddress}`
    })
    res.json({ result: 'ok' })
  } catch (err) {
    logger({
      level: 5,
      id: req.user && req.user.email ? req.user.email : '',
      message: `방송구간 수정 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.put('/addchildrens', async(req, res) => {
  try {
    const { id, childrens } = req.body
    const r = await Zones.updateOne({ _id: id}, { $set: { children: childrens}})
    console.log(r)
    res.json(r)
  } catch (err) {
    logger({
      level: 5,
      id: req.user.email,
      message: `방송구간 지역 추가 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

router.get('/delete', async (req, res) => {
  try {
    await Zones.deleteOne({ _id: req.query.id })
    logger({
      level: 0,
      id: req.user.email,
      message: `방송구간 삭제 Name: ${req.query.name}`
    })
  } catch (err) {
    logger({
      level: 5,
      id: req.user.email,
      message: `방송구간 삭제 오류 ${JSON.stringify(err)}`
    })
    res.status(500).json({ error: err })
  }
})

module.exports = router
