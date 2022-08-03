const express = require('express')
const router = express.Router()

const { isAdmin, loggedIn } = require('api/users/loggedIn')
const { isAuth, checkEmail, register, login, logout } = require('api/users')
const { getUsers, setAdmin, deleteUser } = require('api/users/admin')

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

module.exports = router
