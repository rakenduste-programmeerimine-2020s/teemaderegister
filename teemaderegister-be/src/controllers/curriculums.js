const { matchedData } = require('express-validator/filter')
const Promise = require('bluebird')
const Curriculum = require('../models/curriculum')
const Topic = require('../models/topic')
const User = require('../models/user')
const { TopicsQuery } = require('../utils/queryHelpers')
const { Error } = require('../utils/errors')

const slug = require('slug')

module.exports.getCurriculums = async (req, res) => {
  const curriculums = await Curriculum.aggregate([
    { $sort: { type: -1, 'names.et': 1 } },
    {
      $group: {
        _id: '$type',
        // collection: { $push: '$$ROOT' }, //full object
        collection: {
          $push: {
            names: '$names',
            slugs: '$slugs',
            _id: '$_id',
            abbreviation: '$abbreviation',
            languages: '$languages',
            closed: '$closed'
          }
        },
        count: { $sum: 1 }
      }
    }
  ])

  curriculums.map(o => {
    o.type = o._id
    return o
  })

  return res.json({ curriculums })
}

module.exports.getCurriculumBySlug = async (req, res) => {
  const curriculumMeta = await Curriculum
    .findOne({ $or: [{'slugs.et': req.params.slug}, {'slugs.en': req.params.slug}] })
    .populate('representative', '_id profile')

  if (!curriculumMeta) throw new Error(`no curriculum with slug ${req.params.slug}`)

  const extend = { curriculums: { $in: [curriculumMeta._id] } }
  const countUsers = users => User.count({ _id: { $in: users } })

  const [
    all,
    registered,
    available,
    defended,
    allSupervisors,
    supervised
  ] = await Promise.all([
    Topic.count(TopicsQuery('all', extend)),
    Topic.count(TopicsQuery('registered', extend)),
    Topic.count(TopicsQuery('available', extend)),
    Topic.count(TopicsQuery('defended', extend)),
    Topic.distinct('supervisors.supervisor', TopicsQuery('all', extend))
      .then(users => countUsers(users)),
    Topic.distinct('supervisors.supervisor', TopicsQuery('defended', extend))
      .then(users => countUsers(users))
  ])

  const data = {
    meta: curriculumMeta,
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

module.exports.postCurriculums = async (req, res) => {
  const {
    abbreviation,
    type,
    representative,
    faculty,
    languages,
    names
  } = matchedData(req)

  const slugs = { et: slug(names.et), en: slug(names.en) }

  const existingCurriculum = await Curriculum.findOne({
    $or: [
      { 'slugs.et': slugs.et },
      { 'slugs.en': slugs.en },
      { 'abbreviation': abbreviation }
    ]
  })
  if (existingCurriculum) {
    let errorMsg = existingCurriculum.abbreviation === abbreviation
      ? 'Curriculum with set abbreviation already exists'
      : 'Curriculum with set et/en names already exists'
    throw new Error(errorMsg)
  }

  const curriculum = await new Curriculum({
    names,
    slugs,
    abbreviation,
    faculty,
    languages,
    representative,
    type
  }).save()

  return res.status(201).send({ curriculum })
}
