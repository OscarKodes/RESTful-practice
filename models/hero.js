const mongoose = require("mongoose");
const Review = require("./review");

const heroSchema = new mongoose.Schema ({
  name: String,
  author: {
    id: {
          type: mongoose.Schema.Types.Object,
          ref: "User"
        },
    username: String
    },
  date: { type: Date, default: Date.now},
  image: String,
  info: String,
  reviews: [
     {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
     }
  ],
  berries: [
     {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Berry"
     }
  ]
});

module.exports = mongoose.model("Hero", heroSchema);
