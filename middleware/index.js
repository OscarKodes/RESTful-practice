// require
const Review = require("../models/review"),
      Hero = require("../models/hero");


// middleware object
let middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that.");
  res.redirect("/login");
}

middlewareObj.checkReviewOwnership = function (req, res, next) {
  // check if logged in
  if (req.isAuthenticated()) {
    // find specific review
    Review.findById(req.params.review_id, function(err, foundReview){
      if (err) {
        res.redirect("/404");
      } else {
        if (foundReview.author.id.equals(req.user._id)) {
          next();
        } else {
          // flash message telling user not allowed
          req.flash("error", "You are not authorized to do that.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
  }
}

middlewareObj.checkHeroOwnership = function (req, res, next) {
  // check if user logged in
  if (req.isAuthenticated()) {
    // search for hero to modify with id
    Hero.findById(req.params.id, function(err, foundHero){
      if (err) {
        res.redirect("/404");
      } else {
        // check if user owns this hero object
        if (foundHero.author.id && foundHero.author.id.equals(req.user._id)) {
          next();
        } else {
          // put flash message telling them not allowed
          res.redirect("back");
          req.flash("error", "You are not authorized to do that.");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
  }
}


module.exports = middlewareObj;
