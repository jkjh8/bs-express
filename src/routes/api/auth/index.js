import express from 'express'
const router = express.Router()

import { isAdmin, loggedIn } from '@/api/users/loggedIn'
import { isAuth, checkEmail, register, login, logout } from '@/api/users'
import { getUsers, setAdmin, deleteUser } from '@/api/users/admin'

// user default functions
router.get('/', isAuth)
router.post('/', login)
router.get('/logout', logout)

// user register functions
router.get('/checkEmailUsed', checkEmail)
router.post('/register', register)

// admin functions
router.get('/users', isAdmin, getUsers)
router.get('/setadmin', isAdmin, setAdmin)
router.get('/deleteuser', loggedIn, deleteUser)

export default router
