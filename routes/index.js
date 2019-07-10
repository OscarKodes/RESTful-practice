const express     = require("express"),
  router          = express.Router(),
  passport        = require("passport"),
  User            = require("../models/user"),
  middleware      = require("../middleware");


// ROUTES =========================================
router.get("/", function(req, res) {
  res.redirect("/heroes");
});

// show register form
router.get("/register", function(req, res) {
  res.render("register")
});

// handle registration
router.post("/register", function(req, res) {
  let newUser = new User({
    username: req.body.username,
  });

  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }

    passport.authenticate("local")(req, res, function() {
      res.redirect("/heroes");
    });
  });
});

// show login form
router.get("/login", function(req, res) {
  res.render("login");
});

// handle login
router.post("/login", passport.authenticate("local", {
  successRedirect: "/heroes",
  failureRedirect: "/login"
}), function(req, res) {});

// logout route
router.get("/logout", middleware.isLoggedIn, function(req, res) {
  req.logout();
  res.redirect("/heroes");
});

// ERROR Routes
router.get("/404", function(req, res) {
  res.render("error");
});

router.get("*", function(req, res) {
  res.redirect("/404");
});



module.exports = router;
