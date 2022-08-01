const express = require('express')
const passport = require('passport')
const router = express.Router()
const { logger, loggerArr } = require('api/logger')

const User = require('db/models/user')

router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user })
  } else {
    return res.send({ user: null })
  }
})

router.get('/checkEmailUsed', async(req, res) => {
  try {
    return res.status(200).json(await User.exists({ email: req.query.email }))
  } catch (err) {
    loggerArr(5, 'Server', err)
    return res.status(500).json({ error: err, status: false })
  }
})

router.get('/checkemail', async (req, res) => {
  try {
    return res.status(200).json(await User.exists({ email: req.query.email }))
  } catch (err) {
    loggerArr(5, 'Server', err)
    return res.status(500).json({ error: err, status: false })
  }
})

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  const r = await User.findOne({ email: email })
  if (r) {
    return res.status(403).send('사용중인 이메일 입니다.')
  }
  const user = new User({ name, email, password })
  try {
    await user.save()
    loggerArr(3, 'Server', `회원가입: ${email}`)
    return res.status(200).send(null)
  } catch (err) {
    loggerArr(5, 'Server', `회원가입 오류 ${err}`)
    return res.status(500).json(err)
  }
})

router.post('/', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      loggerArr(5, 'Server', `사용자 로그인 오류 ${err}`)
      return res.status(500).json({ status: false, error: err })
    }
    if (!user) {
      return res.json({ status: false, ...info })
    }

    req.login(user, async (err) => {
      if (err) {
        loggerArr(5, 'Server', `사용자 로그인 오류 ${err}`)
        return res.status(401).json({ status: false, error: err })
      }
      await User.updateOne(
        { email: user.email },
        { $set: { loginAt: new Date(), numberOfLogin: user.numberOfLogin + 1 } }
      )
      loggerArr(3, user, `사용자 로그인 ${user.email}`)
      return res.status(200).json({ status: true })
    })
  })(req, res, next)
})

router.get('/logout', async (req, res) => {
  try {
    const id = req.user._id
    loggerArr(3, req.user, '사용자 로그아웃')
    req.logout()
    return res.status(200).json({ user: null, message: 'logout completed' })
  } catch (err) {
    loggerArr(5, 'Server', `사용자 로그아웃 오류 ${err}`)
    return res
      .status(500)
      .json({ user: null, message: 'logout failed', error: err })
  }
})

router.get('/users', async (req, res) => {
  try {
    if (!req.user) return res.sendStatus(403)
    if (!req.user.admin) return res.sendStatus(403)
    res.json({ users: await User.find({}, { password: 0 }) })
  } catch (err) {
    loggerArr(5, 'Server', `사용자 정보확인 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/setadmin', async (req, res) => {
  try {
    if (!req.user) return res.sendStatus(403)
    if (!req.user.admin) return res.sendStatus(403)
    await User.findByIdAndUpdate(req.query.id, {
      $set: { admin: req.query.admin === 'true' }
    })
    res.sendStatus(200)
  } catch (err) {
    loggerArr(5, 'Server', `사용자 권한변경 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

router.get('/deleteuser', async (req, res) => {
  try {
    // 권한 확인
    const { user } = req
    const { email } = req.query

    if (user.admin || user.email === email) {
      // delete
      await User.deleteOne({ email: email })
      loggerArr(3, user.email, `사용자 삭제 Name: ${email}`)
  
      // 로그아웃
      if (user.email === email) {
        req.logout()
      }
      return res.sendStatus(200)
    }
    
    return res.sendStatus(403)

  } catch (err) {
    loggerArr(5, req.user, `사용자 삭제 오류 ${err}`)
    return res.status(500).json({ error: err })
  }
})

module.exports = router
