import passport from 'passport'

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use("local",new GoogleStrategy({
        clientID: "277847762945-6qr1312a36jh9fgf84f26kug5ebbjo0v.apps.googleusercontent.com",
        clientSecret: "JHNejTLf-QLygG-p_xiyfT8-",
        callbackURL: "http://www.example.com/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        /*
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });*/
    }
));


