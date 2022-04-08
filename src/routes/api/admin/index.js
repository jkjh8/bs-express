const express = require('express')
const router = express.Router()
const logger = require('logger')

router.use('/devicelog', require('./deviceLog'))

module.exports = router
