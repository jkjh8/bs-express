const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('db/models/user')

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('serialize')
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    console.log('deserialize')
    User.findOne({ id: id }, { password: 0 }, (err, user) => {
      done(err, user)
    })
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
