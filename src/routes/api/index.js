const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.send('<h2>API First Page</h2>')
})

router.use('/auth', require('./auth'))

module.exports = router
