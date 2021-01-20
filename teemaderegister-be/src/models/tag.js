const mongoose = require("mongoose");
const tagSchema = new mongoose.Schema({
  tag: { type: String, required: true },
});

const Tag = mongoose.model("tags", tagSchema);

module.exports = Tag;
