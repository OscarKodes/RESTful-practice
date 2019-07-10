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
      req.flash("warning", err.message);
      return res.redirect("/register");
    }

    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to the Hero Database, " + newUser.username + "!");
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
  successFlash: "Successfully Logged In!",
  failureRedirect: "/login",
  failureFlash: true
}), function(req, res) {});

// logout route
router.get("/logout", middleware.isLoggedIn, function(req, res) {
  req.logout();
  req.flash("success", "You have been logged out.");
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
