// SETUP =========================================

const express     = require("express"),
  app             = express(),
  methodOverride  = require("method-override"),
  bodyParser      = require("body-parser"),
  mongoose        = require("mongoose"),
  ejs             = require("ejs"),
  passport        = require("passport"),
  LocalStrategy   = require("passport-local"),
  Hero            = require("./models/hero"),
  Berry           = require("./models/berry"),
  User            = require("./models/user"),
  Review          = require("./models/review"),
  seedDB          = require("./seeds");


// connect to mongodb
mongoose.connect("mongodb://localhost:27017/rest-practice", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// Tells express to use ejs files in the views folder
app.set('view engine', 'ejs');

// Tell express to serve up the public folder as a static resource
app.use(express.static(__dirname + '/public'));

// Tells express to use bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));

// Tells express to use methodOverride
app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "One Two Buckle My Shoe Pikachu",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// UNCOMMENT THE SEEDDB LINE BELOW !!
// TO REMOVE ALL HERO OBJECTS !!
// AND RESET SAMPLE FILES !!
// seedDB();


// declaring middleware function for all routes
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});


// ROUTES =========================================
app.get("/", function(req, res) {
  res.redirect("/heroes");
});

// INDEX
app.get("/heroes", function(req, res) {
  Hero.find({}, function(err, foundHeroes) {
    res.render("index", {
      heroes: foundHeroes
    });
  })
});

// NEW
app.get("/heroes/new", isLoggedIn, function(req, res) {
  Berry.find({}, function(err, allBerries) {
    res.render("heroes/new", {
      berries: allBerries
    });
  });
});

// CREATE
app.post("/heroes", isLoggedIn, function(req, res) {

  Hero.create(req.body.hero, function(err, newHero) {
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("*");
    } else {
      newHero.author.id = req.user._id;
      newHero.author.username = req.user.username;
      newHero.save();
      res.redirect("/heroes/" + newHero.id);
    }
  });
});

// Create review
app.post("/heroes/:id/review", isLoggedIn, function(req, res) {

  let submittedReview = new Review ({
    comment: req.body.comment,
    author: req.user
  });

  Review.create(submittedReview, function(err, newReview){
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("*");
    } else {
      Hero.findById(req.params.id, function(err, foundHero){
        if (err) {
          console.log("THERE WAS AN ERROR:", err);
          res.redirect("*");
        } else {
          foundHero.reviews.push(newReview);
          foundHero.save();
          res.redirect("/heroes/" + req.params.id);
        }
      });
    }
  });

  // console.log(req.body);

  // find the hero useing req.params.
  // grab the review with req.body.comment
  // grab the username and id with req.user
  // create the review
  // push the review into the hero's reviews
  // save the hero
  // res.redirect to heros/:id


  // Hero.findById(req.params.id, function(err, foundHero) {
  //
  //     if (err) {
  //       console.log("THERE WAS AN ERROR:", err);
  //       res.redirect("*");
  //     } else {
  //       Review.create(req.body.review, function(err, newReview) {
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           newReview.author = {
  //             id: req.user._id,
  //             username: req.user.username
  //           }
  //           newReview.save();
  //
  //           foundHero.reviews.push(newReview);
  //           foundHero.save(function(err) {
  //             if (err) {
  //               console.log("THERE WAS AN ERROR:", err);
  //               res.redirect("*");
  //             } else {
  //               console.log(foundHero);
  //               res.redirect("/heroes/" + req.params.id);
  //             }
  //           });
  //         }
  //       });
  //     };
  // });
});

// SHOW
app.get("/heroes/:id", function(req, res) {

  Hero.findById(req.params.id).
  populate("berries").
  populate("reviews").
  exec(function(err, foundHero) {
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("*");
    } else {
      res.render("heroes/show", {
        hero: foundHero
      });
    }
  });
});

// EDIT
app.get("/heroes/:id/edit", isLoggedIn, function(req, res) {

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
app.put("/heroes/:id", isLoggedIn, function(req, res) {

  Hero.findByIdAndUpdate(req.params.id, req.body.hero, function(err, foundHero) {
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("*");
    } else {
      res.redirect("/heroes/" + req.params.id);
    }
  });
});

// DESTROY
app.delete("/heroes/:id", isLoggedIn, function(req, res) {

  Hero.findByIdAndDelete(req.params.id, function(err) {
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("*");
    } else {
      res.redirect("/heroes");
    }
  });
});

// ========================================
// AUTH ROUTES ============================
// ========================================

// show register form
app.get("/register", function(req, res) {
  res.render("register")
});

// handle registration
app.post("/register", function(req, res) {
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
app.get("/login", function(req, res) {
  res.render("login");
});

// handle login
app.post("/login", passport.authenticate("local", {
  successRedirect: "/heroes",
  failureRedirect: "/login"
}), function(req, res) {});

// logout route
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/heroes");
});

// ERROR
app.get("*", function(req, res) {
  res.render("error");
});

// middleware function
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}




app.listen(3000, function() {
  console.log("Server is running on port 3000.");
});
