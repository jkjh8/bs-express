const { loggerArr: logger } = require('api/logger')
const User = require('db/models/user')

module.exports.getUsers = async (req, res) => {
  try {
    res.json({ users: await User.find({}, { password: 0 }) })
  } catch (err) {
    logger(5, 'Server', `사용자정보확인오류: ${err}`)
    return res.status(500).json(err)
  }
}

module.exports.setAdmin = async (req, res) => {
  try {
    const user = JSON.parse(req.query.item)
    await User.findByIdAndUpdate(user._id, { $set: { admin: !user.admin } })
    logger(3, 'Server', `관리자권한변경: ${user.email}, ${!user.admin}`)
    res.status(200).send(null)
  } catch (err) {
    logger(5, 'Server', `관리자권한변경오류: ${err}`)
    return res.status(500).json(err)
  }
}

module.exports.deleteUser = async (req, res) => {
  try {
    const user = JSON.parse(req.query.item)
    if (req.user.admin || req.user.email === user.email) {
      await User.deleteOne({ email: user.email })
      logger(3, req.user, `사용자삭제: ${user.email}`)
      if (req.user.email === user.email) {
        req.logout()
      }
      return res.status(200).send(null)
    }
    return res.status(403).send(null)
  } catch (err) {
    logger(5, req.user, '사용자삭제오류')
    return res.status(500).json(err)
  }
}
