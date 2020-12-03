const User = require('../models/user')
const slug = require('slug')
const crypto = require('crypto')
const mail = require('./../utils/mail')

module.exports.createUser = async (req, res) => {
  const {firstName, lastName, email, role} = req.body
  const slugs = `${slug(firstName)}-${slug(lastName)}`

  const alreadyUser = await User
    .findOne({'login.email': email})
  if (alreadyUser) throw new Error(`Email ${email} already in use`)
  const passwordResetURL = crypto.randomBytes(20).toString('hex')
  const user = {
    profile: {
      firstName: firstName,
      lastName: lastName,
      slug: slugs
    },

    login: {
      email: email,
      passwordResetToken: passwordResetURL,
      passwordResetExpires: Date.now() + parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES),
      roles: role
    }
  }

  const newUser = await new User(user).save()

  await mail.sendMail({
    to: email,
    subject: `Password create`,
    template: {
      name: 'passwordReset',
      data: { passwordResetURL }
    }
  })

  if (newUser) {
    console.log('Success')
    return res.status(201).send({newUser})
  }
  return res.status(400).send({success: 0})
}
module.exports.getSecret = async (req, res) => {
  const {user: {_id}} = req

  return res.json({_id})
}
