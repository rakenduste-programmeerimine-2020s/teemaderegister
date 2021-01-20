const Tag = require("../models/tag");

module.exports.getTag = async (req, res) => {
  const [tag] = await Tag.find({});
  return res.json({ tag });
};
