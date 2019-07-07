const mongoose = require("mongoose");
const Hero = require("./models/hero");
const Berry = require("./models/berry");

const sampleData = [{
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

const berrySamples = [{
    name: "Cheri Berry",
    image: "https://cdn.bulbagarden.net/upload/6/61/Bag_Cheri_Berry_Sprite.png"
  },
  {
    name: "Chesto Berry",
    image: "https://cdn.bulbagarden.net/upload/3/3f/Bag_Chesto_Berry_Sprite.png",
  },
  {
    name: "Pecha Berry",
    image: "https://cdn.bulbagarden.net/upload/8/8f/Bag_Pecha_Berry_Sprite.png",
  },
  {
    name: "Oran Berry",
    image: "https://cdn.bulbagarden.net/upload/8/86/Bag_Oran_Berry_Sprite.png",
  },
  {
    name: "Nanab Berry",
    image: "https://cdn.bulbagarden.net/upload/5/53/Bag_Nanab_Berry_Sprite.png",
  }
]

function seedDB() {
  // Remove all
  Hero.deleteMany({}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Removed heroes.");

      // add a sample heroes
      sampleData.forEach(function(hero, i) {
        Hero.create(hero, function(err, newHero) {
          if (err) {
            console.log(err);
          } else {
            console.log("Added hero:", newHero.name);
            newHero.save(function(err) {
              if (err) {
                console.log(err);
              } else {
                if (i === 3) {
                  berrySetUp();
                };
              }
            });
          }
        });
      });
    }
  });
};

function berrySetUp() {

  // Creates berries
  Berry.deleteMany({}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("All berries removed.");
      berrySamples.forEach(function(berry, i) {
        Berry.create(berry, function(err, newBerry) {
          if (err) {
            console.log(err);
          } else {
            console.log("Added", newBerry.name);
            if (i === 4) {
              berryLikes();
            }
          }
        })
      });
    }
  });
}

function berryLikes() {

  Berry.find({}, function(err, allBerries) {

    if (err) {
      console.log(err);
    } else {
      allBerries.forEach(function(berry, idx) {
        Hero.find({}, function(err, allHeroes) {
          if (err) {
            console.log(err);
          } else if (idx < 4) {
            allHeroes[idx].berries.push(berry);
            allHeroes[idx].save(function(err, hero) {
              if (err) {
                console.log(err);
              } else {
                console.log(hero.name + " likes ", hero.berries);
              }
            });
          }
        });
      });
    };
  });
}


module.exports = seedDB;
