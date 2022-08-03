module.exports.loggedIn = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect(403, `/login`)
  }
}

module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    next()
  } else {
    res.redirect(403, '/')
  }
}
