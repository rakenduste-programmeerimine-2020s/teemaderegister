module.exports.getSecret = async (req, res) => {
  const { user: { _id } } = req

  return res.json({ _id })
}
