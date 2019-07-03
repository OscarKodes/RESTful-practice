const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema ({
  name: String,
  date: { type: Date, default: Date.now},
  image: String,
  info: String,
});

module.exports = mongoose.model("Hero", heroSchema);
