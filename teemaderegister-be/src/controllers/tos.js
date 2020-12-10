const TermsOfService = require('../models/tos')

module.exports.getTos = async (req, res) => {
  const tos = await TermsOfService.find({})

  const doc = tos[0]

  return res.json({ doc })
}

module.exports.saveTos = async (req, res) => {
  const { content } = req.body

  const tos = await TermsOfService.find({})

  if (tos.length === 0) {
    await new TermsOfService({ content }).save()
  } else {
    tos[0].content = content
    await tos[0].save()
  }

  return res.json({ message: 'Terms of Service were successfully changed' })
}
