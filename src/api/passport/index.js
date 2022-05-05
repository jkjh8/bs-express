const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('db/models/user')
const { client } = require('db/redis')

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      let user = JSON.parse(await client.get(`USER:LOGIND:${id}`))
      if (user) {
        return done(null, user)
      } else {
        user = await User.findOne({ id: id }, { password: 0 })
        await client.SET(
          `USER:LOGIND:${id}`,
          JSON.stringify(user),
          'EX',
          60 * 5
        )
        return done(null, user)
      }
    } catch (err) {
      return done(err, null)
    }
  })
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email })
          if (!user) {
            return done(null, false, { message: '사용자를 찾을 수 없습니다.' })
          }
          if (await user.verifyPassword(password)) {
            delete user['password']
            return done(null, user, { message: '로그인을 성공했습니다.' })
          }
          done(null, false, { message: '비밀번호가 일치 하지 않습니다.' })
        } catch (err) {
          return done(err)
        }
      }
    )
  )
}
