const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema ({
  comment: String,
  author: {
    id: {
      type: mongoose.Schema.Types.Object,
      ref: "User"
    },
    username: String
  },
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Review", reviewSchema);
