const express     = require("express"),
  router          = express.Router({mergeParams:true}),
  Hero            = require("../models/hero"),
  Review          = require("../models/review");

// Index Route -- the heroes show page doubles as index for review
// New Route -- the heroes show pages doubles as new for review

// Create Route
router.post("/", isLoggedIn, function(req, res) {

  let submittedReview = new Review ({
    comment: req.body.comment,
    author: req.user
  });

  Review.create(submittedReview, function(err, newReview){
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("/404");
    } else {
      Hero.findById(req.params.id, function(err, foundHero){
        if (err) {
          console.log("THERE WAS AN ERROR:", err);
          res.redirect("/404");
        } else {
          foundHero.reviews.push(newReview);
          foundHero.save();
          res.redirect("/heroes/" + req.params.id);
        }
      });
    }
  });
});

// Show Route -- No, need show route, everything can be seen on hero show route

// Edit Route
router.get("/:review_id/edit", function(req, res) {

  Hero.findById(req.params.id, function(err, foundHero){
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("/404");
    } else {
      Review.findById(req.params.review_id, function(err, foundReview){
        if (err) {
          console.log("THERE WAS AN ERROR:", err);
          res.redirect("/404");
        } else {
          res.render("reviews/edit", {hero: foundHero, review: foundReview});
        }
      });
    }
  });
});

// Update Route
router.put("/:review_id", function(req, res){

  Review.findByIdAndUpdate(req.params.review_id, req.body.review, function(err, foundReview){
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("/404");
    } else {
      res.redirect("/heroes/" + req.params.id);
    }
  });
});

// Destroy Route
router.delete("/:review_id", function(req, res){
  Review.findByIdAndDelete(req.params.review_id, function(err){
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("/404");
    } else {
      res.redirect("/heroes/" + req.params.id);
    }
  });
});



// middleware function
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

module.exports = router;
