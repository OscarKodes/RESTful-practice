const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema ({
  comment: String,
  author: String,
  date: {type: Date, default: Date.now}
});

module.exports = reviewSchema;
