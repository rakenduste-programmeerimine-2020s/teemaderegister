const User = require('../models/user')
const slug = require('slug')
const crypto = require('crypto')

module.exports.createUser = async (req, res) => {
  const {firstName, lastName, email, role} = req.body
  const slugs = `${slug(firstName)}-${slug(lastName)}`

  const alreadyUser = await User
    .findOne({'login.email': email})
  if (alreadyUser) throw new Error(`Email ${email} already in use`)

  const user = {
    profile: {
      firstName: firstName,
      lastName: lastName,
      slug: slugs
    },

    login: {
      email: email,
      passwordResetToken: crypto.randomBytes(20).toString('hex'),
      passwordResetExpires: Date.now() + parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES),
      roles: role
    }
  }

  const newUser = await new User(user).save()
  return res.status(201).send({ newUser })
}
module.exports.getSecret = async (req, res) => {
  const {user: {_id}} = req

  return res.json({_id})
}
