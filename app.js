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
  seedDB          = require("./seeds"),
  flash           = require("connect-flash");

// REQUIRE EXTERNAL ROUTE FILES ===================
const heroRoutes    = require("./routes/heroes.js"),
      reviewRoutes  = require("./routes/review.js"),
      indexRoutes   = require("./routes/index.js");

// connect to mongodb
const DATABASEURL = process.env.DATABASEURL || "mongodb://localhost:27017/rest-practice";

mongoose.connect( DATABASEURL, {
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

app.use(flash());

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
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.warning = req.flash("warning");
  next();
});


// tells app to use these routes and include the prefixes
app.use("/heroes", heroRoutes);
app.use("/heroes/:id/review", reviewRoutes);
app.use(indexRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Server is running on port 3000.");
});
