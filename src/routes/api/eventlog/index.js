import express from 'express'
const router = express.Router()

import { loggedIn, isAdmin } from '@/api/users/loggedIn'
import { getEventlog, deleteAllEventlog } from '@/api/logger/eventlog'

router.get('/', loggedIn, getEventlog)
router.get('/deleteall', isAdmin, deleteAllEventlog)

export default router
