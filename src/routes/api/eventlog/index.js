const express = require('express')
const router = express.Router()

const { loggedIn, isAdmin } = require('api/users/loggedIn')
const { getEventlog, deleteAllEventlog } = require('api/logger/eventlog')

router.get('/', loggedIn, getEventlog)
router.get('/deleteall', isAdmin, deleteAllEventlog)

module.exports = router
