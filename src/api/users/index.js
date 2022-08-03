const passport = require('passport')
const { loggerArr: logger } = require('api/logger')
const User = require('db/models/user')

module.exports.isAuth = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user })
  } else {
    return res.send({ user: null })
  }
}

module.exports.checkEmail = async (req, res) => {
  try {
    return res.status(200).json(await User.exists({ email: req.query.email }))
  } catch (err) {
    loggerArr(5, 'Server', err)
    return res.status(500).json({ error: err, status: false })
  }
}

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const user = new User({ name, email, password })
    await user.save()
    logger(3, 'Server', `회원가입: ${email}`)
    return res.status(200).send(null)
  } catch (err) {
    logger(5, 'Server', `회원가입오류: ${err}`)
    return res.status(500).json(err)
  }
}

module.exports.login = async (req, res) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) return res.status(500).json({ status: false, error: err })
    if (!user) return res.json({ status: false, ...info })

    req.login(user, async (err) => {
      if (err) return res.status(401).json({ status: false, error: err })
      await User.updateOne(
        { email: user.email },
        { $set: { loginAt: new Date(), numberOfLogin: user.numberOfLogin + 1 } }
      )

      logger(3, user, `사용자로그인: ${user.email}`)
      return res.status(200).json({ status: true })
    })
  })(req, res)
}

module.exports.logout = async (req, res) => {
  try {
    const { email } = req.user
    req.logout()
    logger(3, 'Server', '사용자로그아웃: ' + email)
    return res.status(200).json({ user: null })
  } catch (err) {
    logger(5, 'Server', '사용자로그아웃오류: ' + err)
    return res.status(500).json({ user: null, error: err })
  }
}
