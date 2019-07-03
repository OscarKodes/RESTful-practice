const mongoose = require("mongoose");
const Review = require("./models/review");
const Hero = require("./models/hero");

var sampleData = [{
    name: "Uravity",
    image: "https://i.pinimg.com/originals/38/2d/aa/382daac96701ee6fe7094f14769c5582.jpg",
    info: "She can make anything float with just the touch of her fingertips!"
  },
  {
    name: "Froppy",
    image: "http://pm1.narvii.com/6150/30a4597011c404a2f4c1aad2983ad096a9135f34_00.jpg",
    info: "She can do anything frogs can do! Ribbit!"
  },
  {
    name: "Deku",
    image: "https://i.pinimg.com/originals/bc/ec/66/bcec662c936cf662ce0ba69daa8197ab.jpg",
    info: "He is on his way to mastering One-For-All, a quirk passed down to him by All Might!"
  },
  {
    name: "Bakugo",
    image: "https://cdn.animenewsnetwork.com/thumbnails/max550x550/cms/news/95917/bakugo-color.jpg",
    info: "He can set off explosions using his own sweat. BOOM!"
  },
]

function seedDB() {
  // Remove all
  Hero.deleteMany({}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Removed heroes.");

      // add a sample heroes
      sampleData.forEach(function(hero) {
        Hero.create(hero, function(err, newHero) {
          if (err) {
            console.log(err);
          } else {
            console.log("Added hero:", newHero.name);

            newHero.reviews.push({
              author: "All Might!",
              comment: "PLUS ULTRA!"
            });
            newHero.reviews.push({
              author: "Eraser Head",
              comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Penatibus et magnis dis parturient montes nascetur ridiculus."
            });
            newHero.save(function(err){
              if (err){
                console.log(err);
              } else {
                console.log("Sample comments added.");
              }
            });
          }
        });
      });
    }
  });
}

module.exports = seedDB;
