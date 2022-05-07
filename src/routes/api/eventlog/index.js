const express = require('express')
const router = express.Router()
const EventLog = require('db/models/eventlog')
const Hangul = require('hangul-js')

router.get('/', async (req, res) => {
  try {
    const { limit, page, search } = req.query
    const searchOptions = []
    if (!req.user || !req.user.admin) {
      searchOptions.push({ level: { $lt: 3 } })
    }
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
    res.status(500).json({ error: err })
  }
})

module.exports = router
