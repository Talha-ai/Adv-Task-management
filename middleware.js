module.exports.isLoggedIn = (req, res, next) => {
  console.log("req.user", req.user);
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}


