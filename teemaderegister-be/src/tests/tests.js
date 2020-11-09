const path = require('path')
const fs = require('fs')
const server = require('../app.js')
const databaseConnection = require('../db')

const supertest = require('supertest')(server)

const Topic = require('../models/topic')
const Curriculum = require('../models/curriculum')
const User = require('../models/user')

const getObjFromJSON = filename =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, filename), 'UTF-8'))

const usersSeed = getObjFromJSON('./seedData/users.json')
const curriculumsSeed = getObjFromJSON('./seedData/curriculums.json')
const topicsSeed = getObjFromJSON('./seedData/topics.json')

describe('/api', () => {
  before(async () => {
    await databaseConnection
    await clearTestDatabase()
    await loadTestDatabase()
  })

  describe('/auth', async () => {
    return require('./routes/auth.test.js')(supertest)
  })

  describe('/supervisors', () => {
    const { slug } = usersSeed[0].profile
    return require('./routes/supervisors.test.js')(supertest, { slug })
  })

  describe('/curriculums', () => {
    const savedCurriculum = curriculumsSeed[0]
    return require('./routes/curriculums.test')(supertest, { savedCurriculum })
  })
})

const clearTestDatabase = async () => {
  await User.remove({})
  await Curriculum.remove({})
  await Topic.remove({})
}

const loadTestDatabase = () => Promise.all([
  User.create(usersSeed),
  Curriculum.create(curriculumsSeed),
  Topic.create(topicsSeed)
])
