const express = require('express')
const router = express.Router()
const logger = require('logger')
const Zones = require('db/models/zones')

router.get('/exists', async (req, res) => {
  try {
    const r = await Zones.exists({ index: req.query.index })
    return res.json({ result: r })
  } catch (err) {
    logger.error(`방송구간 인덱스 검증 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})
module.exports = router
