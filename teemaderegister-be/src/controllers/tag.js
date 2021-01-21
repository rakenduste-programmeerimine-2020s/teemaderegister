const Tag = require("../models/tag");

module.exports.getTag = async (req, res) => {
  const tag = req.body;
  return res.json({ tag });
};
