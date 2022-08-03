import passport from 'passport'
import { loggerArr as logger } from '@/api/logger'
import User from '@/db/models/user'

export async function isAuth(req, res) {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user })
  } else {
    return res.send({ user: null })
  }
}

export async function checkEmail(req, res) {
  try {
    return res.status(200).json(await User.exists({ email: req.query.email }))
  } catch (err) {
    loggerArr(5, 'Server', err)
    return res.status(500).json({ error: err, status: false })
  }
}

export async function register(req, res) {
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

export async function login(req, res) {
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

export async function logout(req, res) {
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
