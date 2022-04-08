const express = require('express')
const passport = require('passport')
const router = express.Router()
const logger = require('logger')
const redis = require('db/redis')

const User = require('db/models/user')

router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user })
  } else {
    res.send({ user: null })
  }
})

router.get('/checkEmail', async (req, res) => {
  try {
    const { email } = req.query
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
    if (err) {
      logger.error(`사용자 로그인 오류 ${err}`)
      return res.status(500).json({ status: false, error: err })
    }
    if (!user) {
      return res.json({ status: false, ...info })
    }

    req.login(user, async (err) => {
      if (err) {
        logger.error(`사용자 로그인 오류 ${err}`)
        return res.status(401).json({ status: false, error: err })
      }
      const nUser = await User.updateOne(
        { email: user.email },
        { $set: { loginAt: new Date(), numberOfLogin: user.numberOfLogin + 1 } }
      )
      logger.info(`사용자 로그인 ${user.email}`)
      res.status(200).json({ status: true })
    })
  })(req, res, next)
})

router.get('/logout', async (req, res) => {
  try {
    const id = req.user._id
    logger.info(`사용자 로그아웃 ${req.user.email}`)
    await redis.client.DEL(`USER:LOGIND:${id}`)
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

router.get('/setadmin', async (req, res) => {
  try {
    const r = await User.findByIdAndUpdate(req.query.id, {
      $set: { admin: req.query.admin === 'true' }
    })
    res.sendStatus(200)
  } catch (err) {
    logger.error(`사용자 권한 변경 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

router.get('/deleteuser', async (req, res) => {
  try {
    await User.deleteOne({ _id: req.query.id })
    res.sendStatus(200)
  } catch (err) {
    logger.error(`사용자 권한 삭제 오류 ${err}`)
    res.status(500).json({ error: err })
  }
})

module.exports = router
