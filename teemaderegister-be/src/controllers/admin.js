const User = require('../models/user')
const Topic = require('../models/topic')
const Joi = require('joi')
const slug = require('slug')
const mail = require('./../utils/mail')
const {getPasswordResetTokenValues} = require('./auth')
const Curriculum = require('../models/curriculum')

const createSchema = Joi.object({
  status: Joi.string().allow('registered', 'available', 'defended').required()
})

module.exports.getSupervisorTopics = async (req, res) => {
  const {_id} = req.user
  const { value, error } = await createSchema.validate(req.body)
  const {status} = value
  if (error) return res.status(400)

  const query = { 'supervisors.supervisor': _id }
  query[status] = {$exists: true}
  const topics = await Topic.find(query)
  return res.json(topics)
}

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
  const { user: { _id } } = req

  return res.json({ _id })
}
module.exports.getCurriculums = async (req, res) => {
  const curriculums = await Curriculum.find({}).populate('representative', '_id profile')

  res.json(curriculums)
}

module.exports.getUserData = async (req, res) => {
  const users = await User.find({}, {_id: 1, 'profile.slug': 1})
  res.json(users)
}

module.exports.putCurriculums = async (req, res) => {
  const {curriculum_id, userId, closed} = req.body
  // eslint-disable-next-line standard/object-curly-even-spacing
  let curriculum = await Curriculum.findOne({_id: curriculum_id })
  if (userId) {
    const user = await User.findOne({_id: userId})
    if (!user) return res.json({message: 'User Not found', error: true})
    curriculum.representative = userId
  }

  curriculum.closed = closed ? new Date() : null

  await curriculum.save()
  res.json({message: 'Curriculum Updated', error: false})
}
