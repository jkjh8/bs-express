const express = require('express')
const passport = require('passport')
const router = express.Router()
const logger = require('config/logger')

const User = require('db/models/user')

router.get('/', (req, res, next) => {
  logger.info('get auth')
  if (req.isAuthenticated()) {
    res.json({ user: req.user })
  } else {
    res.send({ user: null })
  }
})

router.get('/checkEmail', async (req, res) => {
  try {
    const { email } = req.query
    console.log(email)
    const r = await User.findOne({ email: email })
    if (r) {
      res.status(200).json({ user: r, status: true })
    } else {
      res.status(200).json({ user: null, status: false })
    }
  } catch (err) {
    logger.error(err)
    res.status(500).json({ error: err, status: false })
  }
})

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  const r = await User.findOne({ email: email })
  if (r) {
    return res.status(403).json({ message: '사용중인 이메일 입니다.' })
  }
  const user = new User({ name, email, password })
  try {
    await user.save()
    logger.info(`회원가입: ${email}`)
    return res.status(200).json(user)
  } catch (error) {
    logger.error(`회원가입오류 ${email}`)
    return res.status(500).json({ message: error.message })
  }
})

router.post('/', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    console.log(err, user, info)
    if (err) {
      logger.error(`사용자 로그인 오류 ${err}`)
      return res.status(500).json({ status: false, error: err })
    }
    if (!user) {
      return res.json({ status: false, ...info })
    }

    req.login(user, (err) => {
      if (err) {
        logger.error(`사용자 로그인 오류 ${err}`)
        return res.status(401).json({ status: false, error: err })
      }
      logger.info(`사용자 로그인 ${user.email} ~~~ ${res}`)
    })
    res.status(200).json({ status: true })
    // User.updateOne(
    //   { email: user.email },
    //   { $set: { loginAt: new Date(), numberOfLogin: user.numberOfLogin + 1 } }
    // ).exec()
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  try {
    logger.info(`사용자 로그아웃 ${req.user.email}`)
    req.logout()
    res.status(200).json({ user: null, message: 'logout completed' })
  } catch (error) {
    logger.error(`사용자 로그아웃 오류 ${error}`)
    res.status(500).json({ user: null, message: 'logout failed', error: error })
  }
})

router.get('/users', async (req, res) => {
  try {
    const r = await User.find({}, { password: 0 })
    res.json({ users: r })
  } catch (err) {
    logger.error(`사용자 정보 확인 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

module.exports = router
