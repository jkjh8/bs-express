const express = require('express')
const router = express.Router()
const { loggerArr } = require('api/logger')
const Zones = require('db/models/zones')
const { qsysSetTx } = require('api/device/qsys')

const { loggedIn } = require('api/users/loggedIn')
const { getZones } = require('api/zones')

router.get('/', loggedIn, getZones)
router.get('/idxexists', async (req, res) => {
  try {
    const { index, id } = req.query
    return res.json({
      result: await Zones.exists({
        $and: [{ index: index }, { _id: { $ne: id } }]
      })
    })
  } catch (err) {
    loggerArr(5, req.user, `방송구간 인덱스 검증 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/coreexists', async (req, res) => {
  try {
    const { coreid, zoneid } = req.query
    return res.json(
      await Zones.exists({ $and: [{ core: coreid }, { _id: { $ne: zoneid } }] })
    )
  } catch (err) {
    loggerArr(5, req.user, `방송구간 인덱스 검증 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

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

router.post('/', async (req, res) => {
  try {
    const item = req.body
    console.log(item)
    const r = await Zones({ ...item }).save()
    loggerArr(
      0,
      req.user,
      `방송구간추가 ${item.name} ${item.core.name}:${item.core.ipaddress}`
    )
    res.status(200).json(r)
  } catch (err) {
    loggerArr(5, req.user, `방송구간추가 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.put('/', async (req, res) => {
  try {
    const item = req.body
    const r = await Zones.updateOne({ _id: item._id }, { $set: item })

    const children = []
    for (let i = 0; i < item.children.length; i++) {
      if (item.children[i]) {
        children.push(`${i + 1}:${item.children[i].name}`)
      } else {
        children.push(`${i + 1}: Null`)
      }
    }

    loggerArr(
      0,
      req.user,
      `방송구간수정 ${item.name} ${item.core.name}: ${
        item.core.ipaddress
      } ${children.join(',')}`
    )
    return res.status(200).json(r)
  } catch (err) {
    loggerArr(5, req.user ?? '', `방송구간수정 오류 ${err}`)
    return res.status(500).json(err)
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

router.get('/delete', async (req, res) => {
  try {
    const item = JSON.parse(req.query.item)
    await Zones.deleteOne({ _id: item._id })
    loggerArr(0, req.user, `방송구간 삭제 ${item.index}:${item.name}}`)
    return res.sendStatus(200)
  } catch (err) {
    loggerArr(5, req.user, `방송구간 삭제 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

module.exports = router
