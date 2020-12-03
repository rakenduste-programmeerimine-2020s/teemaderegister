const Tos = require('../models/tos')

module.exports.getTos = async (req, res) => {
  const tos = await Tos.find(
    {
      $content: {}
    }
  )

  console.log(tos)

  const first = tos[0]

  res.json({ first })
}

module.exports.saveTos = async (req, res) => {
  const { content } = req.body

  await Tos.replaceOne({ $content: {} }, { $content: content })

  return res.json({ message: 'Terms of Service were successfully changed' })
}
