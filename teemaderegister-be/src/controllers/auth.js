const slug = require('slug')
const crypto = require('crypto')
const { matchedData } = require('express-validator/filter')
const User = require('../models/user')
const log = require('../utils/logger')
const mail = require('./../utils/mail')
const { signToken, blacklistToken } = require('../utils/jwt')

const { Error, InsertToken } = require('../utils/errors')

module.exports.getPasswordResetTokenValues = () => {
  return {
    passwordResetToken: crypto.randomBytes(20).toString('hex'),
    passwordResetExpires: Date.now() + parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES)
  }
}

module.exports.localLogin = async (req, res) => {
  const { email, password, token } = req.body

  const user = await User.findOne({ 'login.email': email })
  if (!user) throw new Error('Email or password incorrect')

  const attemptAllowed = await user.validateLocalLoginAttempt(req.connection.remoteAddress)
  if (!attemptAllowed) throw new Error('Too many unsuccessful login attempts. Check your email.')

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new Error('Email or password incorrect')
  }
  if (user.auth.enabled) {
    if (!token) throw new InsertToken('Please insert token!')
  }

  user.login.localLoginAttempts = []
  user.login.localLoginBlocked = null
  await user.save()

  return res.json({ token: signToken(user) })
}

module.exports.localSignup = async (req, res) => {
  const { firstName, lastName, email, password, roles } = matchedData(req)

  const existingUser = await User.findOne({ 'login.email': email })
  if (existingUser) { throw new Error('Account with that email address already exists') }

  const user = await new User({
    profile: {
      firstName,
      lastName,
      slug: slug(firstName + ' ' + lastName)
    },
    login: {
      email,
      password,
      roles
    }
  }).save()

  if (!user) throw new Error('No user created')

  return res.status(201).send({ message: 'User created' })
}

module.exports.logout = async (req, res) => {
  // blacklist active token
  const blacklisted = await blacklistToken(req.user)
  if (!blacklisted) throw new Error('Unable to blacklist active token')

  log.debug(`${req.user._id} token blacklisted`)
  return res.json({ message: 'successfully logged out' })
}

module.exports.forgotPassword = async (req, res) => {
  const resetLinkSuccessMessage = `Password reset link has been sent to ${req.body.email}`
  const user = await User.findOne({'login.email': req.body.email})
  if (!user) {
    // Consider message whether we should reveal registered emails
    return res.json({ message: resetLinkSuccessMessage })
  }

  const { email, passwordResetExpires } = user.login

  // passwordResetExpires holds Date.now() + 1 hour timestamp
  // Check if reset link has been sent already (avoid spam)
  // Avoid spam sending. E.g.: last reset sent + link limit (5min) > Date.now()
  const passwordResetSent =
    passwordResetExpires - parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES)
  if (passwordResetSent &&
    passwordResetSent + parseInt(process.env.PASSWORD_RESET_LINK_LIMIT) > Date.now()) {
    throw new Error(`Password reset link has been already sent. Please wait to request new one.`)
  }
  user.login = {
    ...user.login,
    ...this.getPasswordResetTokenValues(),
    passwordResetToken: crypto.randomBytes(20).toString('hex'),
    passwordResetExpires: Date.now() + parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES)
  }

  await user.save()

  const passwordResetURL =
    `${process.env.SITE_URL}/account/password/${user.login.passwordResetToken}`

  await mail.sendMail({
    to: email,
    subject: `Password reset`,
    template: {
      name: 'passwordReset',
      data: { passwordResetURL }
    }
  })

  res.json({ message: resetLinkSuccessMessage })
}

module.exports.validatePasswordResetToken = async (req, res) => {
  const user = await User.findOne({
    'login.passwordResetToken': req.params.token,
    'login.passwordResetExpires': { $gt: Date.now() }
  })
  if (!user) {
    throw new Error('Password reset link invalid or expired. Please try again or contact your administrator')
  }

  res.json({ message: 'Please fill required fields for password reset' })
}

module.exports.updatePassword = async (req, res) => {
  const user = await User.findOne({
    'login.passwordResetToken': req.params.token,
    'login.passwordResetExpires': { $gt: Date.now() }
  })
  if (!user) {
    throw new Error('Password reset link invalid or expired. Please try again or contact your administrator')
  }

  user.login = {
    ...user.login,
    password: req.body.password,
    passwordResetToken: undefined,
    passwordResetExpires: undefined,
    passwordUpdatedAt: Date.now()
  }

  await user.save()

  res.json({ message: 'Password reset has been successfully completed. Use your new password for login.' })
}
