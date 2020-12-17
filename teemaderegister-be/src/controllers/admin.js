const User = require('../models/user')
const slug = require('slug')
const mail = require('./../utils/mail')
const {getPasswordResetTokenValues} = require('./auth')

module.exports.createUser = async (req, res) => {
  const {firstName, lastName, email, role} = req.body
  const slugs = `${slug(firstName)}-${slug(lastName)}`

  const existingUser = await User.findOne({'login.email': email})
  if (existingUser) {
    return res.status(406).json({message: 'Email already in use!', success: 0})
  }
  const user = {
    profile: {
      firstName: firstName,
      lastName: lastName,
      slug: slugs
    },

    login: {
      email: email,
      roles: role,
      ...getPasswordResetTokenValues()
    }
  }
  const passwordCreateURL = `${process.env.SITE_URL}/account/password/${user.login.passwordResetToken}?is-new=1`

  await new User(user).save()

  await mail.sendMail({
    to: email,
    subject: `Password create`,
    template: {
      name: 'createPassword',
      data: {passwordCreateURL}
    }
  })

  return res.status(201).json({message: 'Created successfully!', success: 1})
}
module.exports.getSecret = async (req, res) => {
  const {user: {_id}} = req

  return res.json({_id})
}
