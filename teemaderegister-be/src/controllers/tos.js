const TermsOfService = require('../models/tos')

module.exports.getTos = async (req, res) => {
  const [tos] = await TermsOfService.find({})

  return res.json({ tos })
}

module.exports.saveTos = async (req, res) => {
  const { content } = req.body

  const [tos] = await TermsOfService.find({})

  if (tos) {
    await new TermsOfService({ content }).save()
  } else {
    tos.content = content
    await tos.save()
  }

  return res.json({ message: 'Terms of Service were successfully changed' })
}
