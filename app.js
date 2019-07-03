// SETUP =========================================

const express   = require("express"),
methodOverride  = require("method-override"),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
ejs             = require("ejs"),
app             = express(),
Hero            = require("./models/hero"),
Berry           = require("./models/berry"),
seedDB          = require("./seeds");



// Tells express to use ejs files in the views folder
app.set('view engine', 'ejs');

// Tell express to serve up the public folder as a static resource
app.use(express.static(__dirname + '/public'));

// Tells express to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// Tells express to use methodOverride
app.use(methodOverride("_method"));

// Mongoose =========================================
mongoose.connect("mongodb://localhost:27017/rest-practice", {useNewUrlParser: true, useFindAndModify: false});


// UNCOMMENT THE SEEDDB LINE BELOW !!
// TO REMOVE ALL HERO OBJECTS !!
// AND RESET SAMPLE FILES !!
// seedDB();

// ROUTES =========================================
app.get("/", function(req, res){
  res.redirect("/heroes");
});

// INDEX
app.get("/heroes", function(req, res){
  Hero.find({}, function(err, foundHeroes){
    res.render("index", {heroes: foundHeroes});
  })
});

// NEW
app.get("/heroes/new", function(req, res){
  Berry.find({}, function(err, allBerries){
    res.render("new", {berries: allBerries});
  });
});

// CREATE
app.post("/heroes", function(req, res){

  Hero.create(req.body.hero, function(err, newHero){
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("*");
    } else {
        res.redirect("/heroes/" + newHero.id);
    }
  });
});

// Create review
app.post("/heroes/:id/review", function(req, res){

  Hero.findById(req.params.id, function(err, foundHero){
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("*");
    } else {
      foundHero.reviews.push(req.body.review);
      foundHero.save(function(err){
        if (err) {
          console.log("THERE WAS AN ERROR:", err);
          res.redirect("*");
        } else {
          console.log(foundHero);
          res.redirect("/heroes/" + req.params.id);
        }
      });
    }
  });
});

// SHOW
app.get("/heroes/:id", function(req, res){



  Hero.findById(req.params.id).populate("berries").exec(function(err, foundHero){
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("*");
    } else {
      res.render("show", {hero: foundHero});
    }
  });
});

// EDIT
app.get("/heroes/:id/edit", function(req, res){

  Hero.findById(req.params.id, function(err, foundHero){
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("error");
    } else {
      Berry.find({}, function(err, allBerries){
        res.render("edit", {hero: foundHero, berries: allBerries});
      });
    }
  });
});

// UPDATE
app.put("/heroes/:id", function(req, res){

  Hero.findByIdAndUpdate(req.params.id, req.body.hero, function(err, foundHero){
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("*");
    } else {
      res.redirect("/heroes/" + req.params.id);
    }
  });
});

// DESTROY
app.delete("/heroes/:id", function(req, res){

  Hero.findByIdAndDelete(req.params.id, function(err){
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("*");
    } else {
      res.redirect("/heroes");
    }
  });
});


// ERROR
app.get("*", function(req, res){
  res.render("error");
});



app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});
