const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const jwtSecret = process.env.SECRET
const validateJwt = expressJwt({ secret: jwtSecret })
const log = require('./logger')
const Token = require('../models/token')
const User = require('../models/user')
const { NotAuthorizedError, ServerError } = require('../utils/errors')

module.exports.jwtEnsure = async (req, res, next) => {
  if (!req.user) {
    // token not valid or expired
    return next(new NotAuthorizedError())
  }

  try {
    // check if blacklisted
    const isBlacklisted = await Token.findOne({ token: JSON.stringify(req.user) })
    if (isBlacklisted) {
      log.warning(`${req.user._id} tried blacklisted token ${isBlacklisted}`)

      return next(new NotAuthorizedError())
    }

    // check if token valid after user data changed
    const user = await User.findById(req.user._id).select('login.passwordUpdatedAt')
    if (!user) return next(new NotAuthorizedError())

    // DO NOT allow if user password changed after last token issued
    const lastPassUpdate = Math.floor(new Date(user.updatedAt) * 1 / 1000)
    if (lastPassUpdate >= req.user.iat) {
      const blacklisted = await this.blacklistToken(req.user)

      if (!blacklisted) return next(new Error('Unable to blacklist active token'))
      log.debug(`${req.user._id} token blacklisted`)

      return next(new NotAuthorizedError())
    }

    // all good, proceed
    return next()
  } catch (err) {
    return next(new ServerError())
  }
}

module.exports.jwtCheck = (req, res, next) => {
  // get user from token for logging, proceed also if invalid
  return validateJwt(req, res, () => next())
}

module.exports.allowRoles = roles => (req, res, next) => {
  // checks if user role matches a given role
  const allowAccess = roles.some(role => {
    return req.user.roles.includes(role)
  })
  if (!allowAccess) return next(new NotAuthorizedError())

  return next()
}

module.exports.signToken = user => {
  const data = {
    _id: user._id,
    roles: user.login.roles,
    ts: new Date().getTime() // unique value
  }
  const expiresIn = parseInt(process.env.TOKEN_EXPIRES_IN_SECONDS)

  return jwt.sign(data, jwtSecret, { expiresIn })
}

module.exports.blacklistToken = user => new Token({
  userId: user._id,
  token: JSON.stringify(user),
  expires: user.exp * 1000
}).save()
