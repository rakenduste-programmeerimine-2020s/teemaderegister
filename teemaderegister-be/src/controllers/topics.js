const Topic = require('../models/topic')
const Promise = require('bluebird')
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

module.exports.getSupervisorTopics = async (req, res) => {
  const {_id} = req.user
  const {search} = req.body

  if (search === 'available') {
    // eslint-disable-next-line standard/object-curly-even-spacing
    const topics = await Topic.find({'supervisors.supervisor': _id, available: {$exists: true} })
    return res.json(topics)
  } else if (search === 'defended') {
    // eslint-disable-next-line standard/object-curly-even-spacing
    const topics = await Topic.find({'supervisors.supervisor': _id, defended: {$exists: true} })
    return res.json(topics)
  } else if (search === 'registered') {
    // eslint-disable-next-line standard/object-curly-even-spacing
    const topics = await Topic.find({'supervisors.supervisor': _id, registered: {$exists: true} })
    return res.json(topics)
  }
  res.json('ERROR')
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
