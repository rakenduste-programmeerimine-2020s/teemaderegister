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
  const passwordCreateURL =
    `${process.env.SITE_URL}/account/password/${user.login.passwordResetToken}?is-new=1`
  console.log(passwordCreateURL)

  try {
    await mail.sendMail({
      to: email,
      subject: `Password create`,
      template: {
        name: 'createPassword',
        data: { passwordCreateURL }
      }
    })
  } catch (e) {
    throw new Error(e)
  }

  const newUser = await new User(user).save()
  if (newUser) {
    return res.status(201).json({ message: 'Created successfully', success: 1 })
  }
  return res.status(400).json({ message: 'Created unsuccessfully', success: 0 })
}
module.exports.getSecret = async (req, res) => {
  const {user: {_id}} = req

  return res.json({_id})
}
