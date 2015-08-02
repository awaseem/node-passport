// config/passport.js

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var TwitterStrategy = require("passport-twitter").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

var configAuth = require("./auth");

var User = require('../app/models/users');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Local sign up
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {

            process.nextTick(function() {

                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        var newUser = new User();

                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));

    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                return done(null, user);
            });

        }));

    // Facebook login
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ["displayName", "emails"]
    }, function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                if (err) {
                    return done(err)
                }

                if (user) {
                    return done(null, user);
                }
                else {
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.displayName;
                    newUser.facebook.email = profile.emails[0].value;

                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    // Twitter login
    passport.use(new TwitterStrategy({
        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL
    }, function (token, tokenSecret, profile, done) {
        process.nextTick(function () {
            User.findOne({ "twitter.id": profile.id }, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    return done(null, user);
                }
                else {
                    var newUser = new User();
                    newUser.twitter.id = profile.id;
                    newUser.twitter.token = token;
                    newUser.twitter.username = profile.username;
                    newUser.twitter.displayName = profile.displayName;
                }

                newUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser);
                });
            });
        });
    }));

    // Google plus login
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    }, function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ 'google.id': profile.id }, function(err, user) {
                if (err) {
                    return done(err);
                }

                if (user) {
                    return done(null, user);
                }
                else {
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                }

                newUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser);
                });
            });
        });
    }));
};