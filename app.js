// SETUP

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



// ROUTES

app.get("/", function(req, res){
  res.send("Hello");
});

app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});
