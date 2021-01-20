const Topic = require('../models/topic')
const Promise = require('bluebird')
const Joi = require('joi')
const { TopicsQuery } = require('../utils/queryHelpers')
const { validateGetTopicsQuery } = require('./../utils/queryValidation')

module.exports.getTopics = async (req, res) => {
  const query = validateGetTopicsQuery(req.query)

  let {
    curriculumId,
    supervisorId,
    q,
    sub,
    page,
    columnKey,
    order,
    types,
    curriculums
  } = query

  let extend = {}
  if (curriculumId) {
    extend = { curriculums: { $in: [curriculumId] } }
  }
  if (supervisorId) {
    extend = { 'supervisors.supervisor': { $in: [supervisorId] } }
  }

  // search
  if (q) {
    const relatedTopicsIds = await exports.getRelatedTopicsIds(q)

    extend = {
      _id: { $in: relatedTopicsIds }
    }
  }

  const pageSize = 20
  const skip = page !== 1 ? (page - 1) * pageSize : 0

  order = order === 'ascend' ? 1 : -1

  let sort = {}
  sort[columnKey] = order

  // TYPES SE BA
  if (types && types.length > 0) extend.types = { $in: [types] }

  if (curriculums && curriculums.length > 0) { extend['curriculums.1'] = { $exists: true } }

  // Aggreaget for better search if needed
  // https://stackoverflow.com/questions/30341341/mongoose-query-full-name-with-regex
  const [topics, count] = await Promise.all([
    Topic.find(TopicsQuery(sub, extend))
      .populate('supervisors.supervisor', '_id profile')
      .populate('curriculums', '_id abbreviation slugs names type')
      .sort(sort)
      .skip(skip)
      .limit(pageSize),
    Topic.count(TopicsQuery(sub, extend))
  ])

  return res.json({ topics, count, query })
}

exports.getRelatedTopicsIds = async q => (await Topic.aggregate([
  {
    $project: {
      fullName: {
        $concat: ['$author.firstName', ' ', '$author.lastName']
      },
      title: 1,
      slug: 1
    }
  },
  {
    $match: {
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } }
      ]
    }
  },
  { $project: { fullName: 0, title: 0, slug: 0 } }
])).reduce((arrayOfIds, topic) => [topic._id, ...arrayOfIds], [])

const TopicSchema = Joi.object({
  title: Joi.string().required().min(1),
  titleEng: Joi.string().required().min(1),
  slug: Joi.string().min(1).replace(' ', '-').required(),

  description: Joi.string(),

  supervisors: Joi.array().items(
      Joi.object({
        type: Joi.string().valid('Main', 'Co').required(),
        supervisor: Joi.string().required()
      }).required()
  ).required(),

  curriculums: Joi.array().items(
      Joi.string().required()
  ).required(),

  types: Joi.array().items(
      Joi.string().valid('SE', 'BA', 'MA', 'PHD').required()
  ).required(),

  author: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string()
  }),

  specialConditions: Joi.string(),

  file: Joi.string(),
  attachments: Joi.array().items(
      Joi.string()
  ),

  accepted: Joi.date(),
  registered: Joi.date(),
  defended: Joi.date(),
  archived: Joi.date(),
  starred: Joi.boolean()
})

module.exports.createTopic = async (req, res) => {
  const topic = req.body

  const {value, error} = TopicSchema.validate(topic)

  if (error) res.json({success: false, message: error.message})

  const newTopic = new Topic(value)
  // eslint-disable-next-line no-unused-vars
  await newTopic.save()

  res.json({success: true})
}
