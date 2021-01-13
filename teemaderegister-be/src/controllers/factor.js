const User = require('../models/user')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')

const secret = speakeasy.generateSecret({
  name: process.env.QR_SECRET
})

module.exports.create = async (req, res) => {
  const {_id} = req.user
  const user = await User.findOne({_id})

  if (user.factor) return res.json('Cannot add anymore!')

  console.log(qrcode.toDataURL(secret.otpauth_url, async (_err, data) => {
    user.auth.secret = secret.base32
    user.auth.image = data
    await user.save()
    res.json(user)
  }))
}
module.exports.enable = async (req, res) => {
  const {_id} = req.user
  const token = req.body.token
  const user = await User.findOne({_id})
  const secret = user.auth.secret

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token
  })
  if (!verified) return res.json({error: true, message: 'False code!'})

  user.auth.enabled = true
  await user.save()
  res.json({error: false, message: '2f enabled!'})
}

module.exports.disable = async (req, res) => {
  const {_id} = req.user
  const token = req.body.token
  const user = await User.findOne({_id})
  const secret = user.auth.secret

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token
  })
  if (!verified) return res.json({error: true, message: 'False code!'})

  user.auth.enabled = false
  await user.save()
  res.json({error: false, message: '2f Disabled!'})
}

module.exports.get = async (req, res) => {
  const {_id} = req.user
  const {auth} = await User.findOne({_id})
  return res.json(auth)
}

module.exports.insert = async (req, res) => {
  const {_id} = req.user
  const token = req.body.token
  const user = await User.findOne({_id})
  const secret = user.auth.secret
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token

  })

  return res.json(verified)
}
