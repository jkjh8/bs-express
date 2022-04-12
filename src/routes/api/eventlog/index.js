const express = require('express')
const router = express.Router()
const logger = require('logger')
const EventLog = require('db/models/eventlog')
const Hangul = require('hangul-js')

router.get('/', async (req, res) => {
  try {
    const { limit, page, search } = req.query
    const searchOptions = []
    if (search && search !== 'undifined' && search !== 'null') {
      searchOptions.push({
        search: new RegExp(Hangul.disassembleToString(search))
      })
    }
    const paginateOptions = { page, limit, sort: { createdAt: -1 } }
    const r = await EventLog.paginate(
      searchOptions.length ? { $and: searchOptions } : {},
      paginateOptions
    )
    res.json(r)
  } catch (err) {
    logger.error(`이벤트 로그 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

module.exports = router
