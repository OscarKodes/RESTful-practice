// SETUP =========================================

const express   = require("express"),
methodOverride  = require("method-override"),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
ejs             = require("ejs"),
app             = express()

// Tells express to use ejs files in the views folder
app.set('view engine', 'ejs');

// Tell express to serve up the public folder as a static resource
app.use(express.static(__dirname + '/public'));

// Tells express to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// Tells express to use methodOverride
app.use(methodOverride("_method"));

// Mongoose =========================================
mongoose.connect("mongodb://localhost:27017/rest-practice", {useNewUrlParser: true});

const heroSchema = new mongoose.Schema ({
  name: String,
  date: { type: Date, default: Date.now},
  image: String,
  info: String,
});

const Hero = mongoose.model("Hero", heroSchema);


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
  res.render("new");
});

// CREATE
app.post("/heroes", function(req, res){

  Hero.create(req.body.hero, function(err, newHero){
    if (err) {
      console.log("THERE WAS AN ERROR:", err);
      res.redirect("*");
    } else {
      console.log(newHero);
      res.redirect("/heroes/" + newHero.id);
    }
  });
});

// SHOW
app.get("/heroes/:id", function(req, res){

  Hero.findById(req.params.id, function(err, foundHero){
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
      res.render("edit", {hero: foundHero});
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
