const moment = require('moment')
exports.TopicsQuery = (type, extra) => {
  const expiration = moment()
    .subtract(parseInt(process.env.TOPICS_EXPIRE_IN_MONTHS), 'months')
    .format('YYYY-MM-DD HH:mm:ss.SSS')

  const all = {}
  const available = {
    accepted: {
      $ne: null,
      $gte: expiration
    },
    registered: null,
    defended: null,
    closed: null
  }
  const registered = {
    accepted: { $ne: null },
    registered: { $ne: null },
    defended: null
  }
  const defended = {
    accepted: { $ne: null },
    registered: { $ne: null },
    defended: { $ne: null }
  }
  const expired = {
    accepted: {
      $ne: null,
      $lt: expiration
    },
    registered: null,
    defended: null,
    closed: null
  }

  const map = {
    all,
    available,
    registered,
    defended,
    expired,
    supervised: defended
  }

  const query = map[type] || all
  return extra ? Object.assign(query, extra) : query
}
