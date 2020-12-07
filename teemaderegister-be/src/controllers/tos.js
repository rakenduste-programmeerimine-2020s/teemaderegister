const TermsOfService = require('../models/tos')

module.exports.getTos = async (req, res) => {
  const tos = await TermsOfService.findById('1')

  return res.json({ tos })
}

module.exports.saveTos = async (req, res) => {
  const { data } = req.body
  // Miks see errorit ei viska? Kas seda koodi ei jooksutata?
  console.log(req.body.test.w.deaw)
  await new TermsOfService({ _id: '1', content: data }).save()

  return res.json({ message: 'Terms of Service were successfully changed' })
}
