const express = require('express')
const router = express.Router()
const { loggerArr } = require('api/logger')
const Zones = require('db/models/zones')
const { qsysSetTx } = require('api/device/qsys')

router.get('/exists', async (req, res) => {
  try {
    return res.json({ result: await Zones.exists({ index: req.query.index }) })
  } catch (err) {
    loggerArr(5, req.user, `방송구간 인덱스 검증 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/existsChildren', async (req, res) => {
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

router.get('/', async (req, res) => {
  try {
    return res.json(
      await Zones.find({})
        .populate('core')
        .populate({ path: 'children', options: { retainNullValues: true } })
    )
  } catch (err) {
    loggerArr(5, req.user, `방송구간 호출 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.post('/', async (req, res) => {
  try {
    await Zones({ ...req.body }).save()
    loggerArr(
      0,
      req.user,
      `방송구간 추가 Name: ${req.body.name} Core: ${req.body.core.ipaddress}`
    )
    res.json({ result: 'OK' })
  } catch (err) {
    loggerArr(5, req.user, `방송구간 추가 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.put('/', async (req, res) => {
  try {
    loggerArr(
      0,
      req.user,
      `방송구간 수정 Name: ${req.body.name} Core: ${req.body.core.ipaddress}`
    )
    return res.json({
      result: await Zones.findOneAndUpdate({ _id: req.body._id }, req.body)
    })
  } catch (err) {
    loggerArr(5, req.user, `방송구간 수정 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.put('/addchildrens', async (req, res) => {
  try {
    await qsysSetTx(req.body)
    loggerArr(
      0,
      req.user,
      `방송구간 ${
        req.body.core.ipaddress
      } 채널이 변경되었습니다. ${req.body.children.map((e) => e ?? 'None')}`
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

router.get('/delete', async (req, res) => {
  try {
    loggerArr(0, req.user, `방송구간 삭제 Name: ${req.query.name}`)
    res.json({ result: await Zones.deleteOne({ _id: req.query.id }) })
  } catch (err) {
    loggerArr(5, req.user, `방송구간 삭제 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

module.exports = router
