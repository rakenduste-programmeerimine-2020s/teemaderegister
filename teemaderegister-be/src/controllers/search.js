const Topic = require('../models/topic')
const User = require('../models/user')
const Promise = require('bluebird')
const { TopicsQuery } = require('../utils/queryHelpers')
const { getRelatedTopicsIds } = require('../controllers/topics')

module.exports.getCounts = async (req, res) => {
  const { q } = req.query
  const relatedTopicsIds = await getRelatedTopicsIds(q)
  const topicExtend = { _id: { $in: relatedTopicsIds } }

  const countUsers = users => {
    return User.aggregate([
      {
        $match: {
          _id: { $in: users }
        }
      },
      {
        $project: {
          fullName: {
            $concat: ['$profile.firstName', ' ', '$profile.lastName']
          }
        }
      },
      { $match: { fullName: { $regex: q, $options: 'i' } } },
      { $count: 'total' }
    ]).then(count => (count[0] ? count[0].total : 0))
  }

  const [
    all,
    registered,
    available,
    defended,
    allSupervisors,
    supervised
  ] = await Promise.all([
    Topic.count(TopicsQuery('all', topicExtend)),
    Topic.count(TopicsQuery('registered', topicExtend)),
    Topic.count(TopicsQuery('available', topicExtend)),
    Topic.count(TopicsQuery('defended', topicExtend)),
    Topic.distinct('supervisors.supervisor', TopicsQuery('all'))
      .then(users => countUsers(users)),
    Topic.distinct('supervisors.supervisor', TopicsQuery('defended'))
      .then(users => countUsers(users))
  ])

  const data = {
    topics: {
      registered,
      available,
      defended,
      all
    },
    supervisors: {
      supervised,
      all: allSupervisors
    }
  }
  return res.json(data)
}
