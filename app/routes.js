// app/routes.js
module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // Facebook routes
    app.get("/auth/facebook", passport.authenticate("facebook", {
        scope: "email"
    }));

    app.get("/auth/facebook/callback", passport.authenticate("facebook", {
        successRedirect: "/profile",
        failureRedirect: "/"
    }));

    // Twitter routes
    app.get("/auth/twitter", passport.authenticate("twitter"));

    app.get("/auth/twitter/callback", passport.authenticate("twitter", {
        successRedirect: "/profile",
        failureRedirect: "/"
    }));

    // Google plus routes
    app.get("/auth/google", passport.authenticate("google", {
        scope: ["profile", "email"]
    }));

    app.get("/auth/google/callback", passport.authenticate("google", {
        successRedirect: "/profile",
        failureRedirect: "/"
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}