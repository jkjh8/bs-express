const express = require('express')
const router = express.Router()
const { loggerArr } = require('api/logger')
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
    return res.json(
      await EventLog.paginate(
        searchOptions.length ? { $and: searchOptions } : {},
        paginateOptions
      )
    )
  } catch (err) {
    loggerArr(5, req.user, `로그 수집 에러 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/deleteall', async (req, res) => {
  try {
    if (req.user && req.user.admin) {
      await EventLog.deleteMany({})
      loggerArr(4, req.user, '전체 로그 메시지를 삭제 하였습니다.')
      return res.send('OK')
    }
    loggerArr(5, req.user, '전체 로그 메시지 삭제 권한이 없습니다.')
    return res.status(403)
  } catch (err) {
    loggerArr(5, req.user, '전체 로그 메시지 삭제 에러 입니다.')
    return res.status(500).json({ error: err })
  }
})
module.exports = router
