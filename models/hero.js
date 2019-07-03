const mongoose = require("mongoose");
const reviewSchema = require("./review");

const heroSchema = new mongoose.Schema ({
  name: String,
  date: { type: Date, default: Date.now},
  image: String,
  info: String,
  reviews: [reviewSchema],
  berries: [
     {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Berry"
     }
  ]
});

module.exports = mongoose.model("Hero", heroSchema);
