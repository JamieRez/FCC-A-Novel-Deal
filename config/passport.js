var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../app/models/user.js').User;
var configAuth = require('./auth.js');

module.exports = function(passport) {

    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({googleId : profile.id}, function(err,user){
        if(err)throw err;

        if(!user){
          user = new User({
            googleId : profile.id,
            name : profile.displayName,
            email : profile.emails[0].value
          });
          user.save(function(err){
            if(err) throw err;
            return done(err,user);
          });
        }
        else {
          return done(err,user);
        }

      });
    }

  ));

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

};
