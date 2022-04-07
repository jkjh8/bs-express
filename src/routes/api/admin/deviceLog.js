const express = require('express')
const router = express.Router()
const logger = require('config/logger')

const DeviceLog = require('db/models/deviceLog')

router.get('/', async (req, res) => {
  try {
    const { limit, page, search } = req.query
    console.log(req.query)
    const searchOptions = []

    if (search && search !== undefined && search !== 'null') {
      searchOptions.push({ $text: { $search: search } })
    }

    const paginateOptions = { page, limit, sort: { timestamp: -1 } }

    const r = await DeviceLog.paginate(
      searchOptions.length ? { $and: searchOptions } : {},
      paginateOptions
    )
    res.json(r)
  } catch (err) {
    logger.error(`디바이스 로그 - 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

module.exports = router
