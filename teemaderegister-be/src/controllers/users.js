const Promise = require('bluebird')
const Jimp = require('jimp')
const slug = require('slug')
const fs = require('fs')
const { matchedData } = require('express-validator/filter')
const User = require('../models/user')
const log = require('../utils/logger')
const { signToken, blacklistToken } = require('../utils/jwt')
const { Error, NotAuthorizedError } = require('../utils/errors')
module.exports.getUser = async (req, res) => {
  // Check if user from token exists
  const user = await User.findById(req.user._id)

  if (!user) throw new NotAuthorizedError()

  let data = {
    user: {
      _id: user._id,
      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        slug: user.profile.slug,
        authentication: user.profile.dataQR,
        asciiQR: user.profile.asciiQR,
        image: {
          full: user.profile.image.full,
          thumb: user.profile.image.thumb
        },
        auth: {
          enabled: user.auth.enabled,
          secret: user.auth.secret,
          image: user.auth.image
        }
      },
      login: {
        email: user.login.email,
        roles: user.login.roles
      },
      updatedAt: user.updatedAt
    }
  }

  // update token if more than X seconds from last token update
  // time to send update token (1h)
  const secondsFromtoUpdate =
    req.user.iat + parseInt(process.env.TOKEN_UPDATE_IN_SECONDS)
  const currentTimestampInSeconds = parseInt(Date.now() / 1000)
  const updateToken = secondsFromtoUpdate <= currentTimestampInSeconds

  if (updateToken) {
    // save prev revoked token
    const blacklisted = await blacklistToken(req.user)
    if (!blacklisted) throw new Error('Unable to blacklist active token')

    log.debug(`${req.user._id} token blacklisted`)
    log.debug(`sending updated token to ${req.user._id}`)
    data.token = signToken(user)
  }

  return res.json(data)
}

module.exports.getProfile = async (req, res) => {
  const user = await User
    .findById(req.user._id)
    .select(`
      -login.password 
      -login.passwordResetToken 
      -login.passwordResetExpires 
      -login.passwordUpdatedAt 
      -user.profile.image.original
    `)

  return res.json({ user })
}

module.exports.updateUser = async (req, res) => {
  const { firstName, lastName, email } = matchedData(req) // validated data

  const userWithSameEmail = await User
    .findOne({
      $and: [
        { _id: { $ne: req.user._id } },
        { 'login.email': email }
      ]
    })
  if (userWithSameEmail) throw new Error(`Email ${email} already in use`)

  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      'profile.firstName': firstName,
      'profile.lastName': lastName,
      // TODO Fix for unique slug, waiting(teemaderegister-be/pull/18)
      'profile.slug': slug(firstName + ' ' + lastName),
      'login.email': email
    }
  })

  return res.json({ message: 'Changes saved' })
}

module.exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body

  const user = await User.findById(req.user._id)
  const isMatch = await user.comparePassword(currentPassword)
  if (!isMatch) throw new Error('Wrong password')

  user.login = {
    ...user.login,
    password: newPassword,
    passwordUpdatedAt: Date.now()
  }
  await user.save()

  return res.json({ message: 'Password was successfully changed' })
}

module.exports.uploadPicture = async (req, res) => {
  if (!req.file) throw new Error('No file uploaded')
  const { file, user } = req

  const image = await Jimp.read(file.path)
  const { width, height } = image.bitmap

  const fullSideLength = parseInt(process.env.PROFILE_PIC_FULL_SIDE_PX)
  const thumbSideLength = parseInt(process.env.PROFILE_PIC_THUMB_SIDE_PX)

  if (width < fullSideLength || height < fullSideLength) {
    throw new Error(`Upload image larger than ${fullSideLength}px`)
  }

  const sizes = {
    full: {
      w: fullSideLength,
      h: fullSideLength
    },
    thumb: {
      w: thumbSideLength,
      h: thumbSideLength
    }
  }

  const original = `profile/original/${user._id}.jpg`
  const full = `profile/full/${user._id}.jpg`
  const thumb = `profile/thumbnail/thumb-${user._id}.jpg`
  const imgQuality = 70

  await Promise.all([
    image
      .cover(sizes.full.w, sizes.full.w)
      .quality(imgQuality)
      .background(0xFFFFFFFF) // PNG background-color
      .write(process.env.UPLOAD_DIR + full),
    image
      .cover(sizes.thumb.w, sizes.thumb.w)
      .quality(imgQuality)
      .background(0xFFFFFFFF)
      .write(process.env.UPLOAD_DIR + thumb)
  ])

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { 'profile.image': { original, full, thumb } } },
    { new: true }
  ).select('profile.image.full updatedAt')

  return res.json({ user: updatedUser, message: 'Picture updated successfully' })
}

module.exports.resetPicture = async (req, res) => {
  const full = 'profile/full/default.jpg'
  const thumb = 'profile/thumbnail/thumb-default.jpg'
  const original = `profile/original/${req.user._id}.jpg`

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { 'profile.image': { orignal: null, full, thumb } } },
    { new: true }
  ).select('profile.image.full updatedAt')

  await fs.unlink(`${process.env.UPLOAD_DIR + original}`, err =>
    log.debug(`${err && err.code} - Probably ${original} already deleted`))

  return res.json({ user, message: 'Picture updated successfully' })
}
module.exports.getAllUsers = async (req, res) => {
  const users = await User.find({}, {'login.password': 0})

  return res.json(users)
}
