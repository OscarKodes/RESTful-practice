const express     = require("express"),
  router          = express.Router({mergeParams:true}),
  Hero            = require("../models/hero"),
  Berry           = require("../models/berry"),
  Review          = require("../models/review");


// INDEX
router.get("/", function(req, res) {
  Hero.find({}, function(err, foundHeroes) {
    res.render("index", {
      heroes: foundHeroes
    });
  })
});

// NEW
router.get("/new", isLoggedIn, function(req, res) {
  Berry.find({}, function(err, allBerries) {
    res.render("heroes/new", {
      berries: allBerries
    });
  });
});

// CREATE
router.post("/", isLoggedIn, function(req, res) {

  Hero.create(req.body.hero, function(err, newHero) {
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("/404");
    } else {
      newHero.author.id = req.user._id;
      newHero.author.username = req.user.username;
      newHero.save();
      res.redirect("/heroes/" + newHero.id);
    }
  });
});

// SHOW
router.get("/:id", function(req, res) {

  Hero.findById(req.params.id).
  populate("berries").
  populate("reviews").
  exec(function(err, foundHero) {
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("/404");
    } else {
      res.render("heroes/show", {
        hero: foundHero
      });
    }
  });
});

// EDIT
router.get("/:id/edit", checkHeroOwnership, function(req, res) {

  Hero.findById(req.params.id, function(err, foundHero) {
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("error");
    } else {
      Berry.find({}, function(err, allBerries) {
        res.render("heroes/edit", {
          hero: foundHero,
          berries: allBerries
        });
      });
    }
  });
});

// UPDATE
router.put("/:id", checkHeroOwnership, function(req, res) {

  Hero.findByIdAndUpdate(req.params.id, req.body.hero, function(err, foundHero) {
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("/404");
    } else {
      res.redirect("/heroes/" + req.params.id);
    }
  });
});

// DESTROY
router.delete("/:id", checkHeroOwnership, function(req, res) {

  Hero.findByIdAndDelete(req.params.id, function(err) {
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("/404");
    } else {
      res.redirect("/heroes");
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

function checkHeroOwnership(req, res, next) {
  // check if user logged in
  if (req.isAuthenticated()) {
    // search for hero to modify with id
    Hero.findById(req.params.id, function(err, foundHero){
      if (err) {
        res.redirect("/404");
      } else {
        // check if user owns this hero object
        console.log(foundHero);
        if (foundHero.author.id && foundHero.author.id.equals(req.user._id)) {
          next();
        } else {
          // put flash message telling them not allowed
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
}





module.exports = router;
