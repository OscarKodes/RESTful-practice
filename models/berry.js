const mongoose = require("mongoose");

const berrySchema = new mongoose.Schema({
  name: String,
  image: String
});

module.exports = mongoose.model("Berry", berrySchema);
