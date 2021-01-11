const Topic = require('../models/topic')

module.exports.findCsvData = async (req, res) => {
  const { status, course } = req.query
  let query = { curriculums: course }
  let sort
  let select
  switch (status) {
    case 'registered':
      query.defended = { $exists: false }
      query.registered = { $exists: true }
      sort = { registered: 'desc' }
      select = 'title author registered curriculums'
      break
    case 'available':
      query.defended = { $exists: false }
      query.registered = { $exists: false }
      sort = { accepted: 'desc' }
      select = 'title createdAt curriculums'
      break
    case 'defended':
      query.defended = { $exists: true }
      sort = { defended: 'desc' }
      select = 'title author defended curriculums'
      break
  }
  await Topic.find(query)
    .sort(sort)
    .populate('supervisors.supervisor', '_id profile.firstName profile.lastName')
    .populate('curriculums')
    .select(select)
    .exec((err, data) => {
      if (!err) {
        res.send(JSON.stringify(data))
      } else {
        console.log(err)
      }
    })
}
