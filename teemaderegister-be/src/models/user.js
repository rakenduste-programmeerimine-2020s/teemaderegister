const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const moment = require('moment-timezone')

const roles = require('../constants/roles')
const mail = require('../utils/mail')
const log = require('../utils/logger')

const userSchema = new mongoose.Schema(
  {
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      image: {
        original: { type: String, default: null },
        full: { type: String, default: 'profile/full/default.jpg' },
        thumb: { type: String, default: 'profile/thumbnail/thumb-default.jpg' }
      }
    },

    login: {
      email: { type: String },
      password: { type: String },
      passwordResetToken: String,
      passwordResetExpires: Date,
      passwordUpdatedAt: { type: Date, default: null },
      localLoginAttempts: [{ ip: String, date: Date }],
      localLoginBlocked: { type: Date, default: null },
      roles: [{
        type: String,
        enum: Object.values(roles)
      }]
    },
    auth: {
      enabled: {type: Boolean, default: false},
      secret: {type: String},
      image: {type: String}
    },

    settings: {
      language: { type: String }
    }
  },
  {
    timestamps: true
  }
)

// Indexes and unique fields
userSchema.index({ 'profile.slug': 1 }, { unique: true })

/**
* Password hash middleware.
* Important! Do not use arrow function, will lose ref to (this)
*/
userSchema.pre('save', async function (next) {
  try {
    const user = this
    if (!user.isModified('login.password')) {
      return next()
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.login.password, salt)

    user.login.password = hash
    user.login.localLoginAttempts = []
    user.login.localLoginBlocked = null

    return next()
  } catch (err) {
    return next(err)
  }
})

/**
* Helper method for validating user's password on login through user.comparePassword
* Important! Do not use arrow function, will lose ref to (this)
*/
userSchema.methods.comparePassword = async function (candidatePassword) {
  const value = await bcrypt.compare(candidatePassword, this.login.password)
  return value
}

userSchema.methods.validateLocalLoginAttempt = async function (ip) {
  const loginAttemptBlockDelay = parseInt(process.env.LOGIN_ATTEMPT_BLOCK_DELAY_IN_MS)

  const lastAttemptTime = this.login.localLoginAttempts.length &&
    this.login.localLoginAttempts[this.login.localLoginAttempts.length - 1].date.getTime()
  const allowedAttemptTime = new Date().getTime() - loginAttemptBlockDelay

  const newAttempt = { ip, date: new Date() }

  if (this.login.localLoginAttempts.length && lastAttemptTime < allowedAttemptTime) {
    this.login.localLoginAttempts = []
    this.login.localLoginBlocked = null
    await this.save()
  }

  if (this.login.localLoginAttempts.length < process.env.LOGIN_ALLOWED_ATTEMPTS) {
    this.login.localLoginAttempts.push(newAttempt)
    await this.save()
    return true
  }

  if (this.login.localLoginBlocked) return false

  const user = this.profile.firstName + ' ' + this.profile.lastName
  const newAttemptTime = moment(newAttempt.date)
    .add(loginAttemptBlockDelay, 'ms')
    .tz('Europe/Tallinn').format('dddd, MMMM Do YYYY, h:mm:ss a z')
  const blockDurationInMinutes = parseInt(loginAttemptBlockDelay / 60 / 1000)

  await mail.sendMail({
    to: this.login.email,
    subject: 'Your Teemaderegister account is temporary locked for security reasons',
    template: {
      name: 'loginBlocked',
      data: { user, newAttemptTime, blockDurationInMinutes }
    }
  }).then(() => {
    log.debug('Local login blocked and email sent')
  })

  this.login.localLoginBlocked = new Date()
  await this.save()

  return false
}

const User = mongoose.model('User', userSchema)

module.exports = User
