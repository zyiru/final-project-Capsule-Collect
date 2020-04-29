module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
		req.flash('error', 'Please log in to your account');
    res.redirect('/login');
  }
}
