const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

//load user model
const User = mongoose.model('User');

// passport authentication based off of:
// https://github.com/bradtraversy/node_passport_login
module.exports = function(passport){
    passport.use(
	new LocalStrategy({usernameField: 'username'}, (username, password, done)=>{
	    // Match user
	    User.findOne({username: username})
		.then(user => {
		    if (!user) {
			return done(null, false, { message: 'User does not exist' });
		    }

		    // Match password
		    if(password === user.hash){
			return done(null, user);
		    }else{
			return done(null, false, {message: 'Password does not match'});
		    }
		});
	})
    );


    
    passport.serializeUser(function(user, done) {
	done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
	    done(err, user);
	});
    });

}
