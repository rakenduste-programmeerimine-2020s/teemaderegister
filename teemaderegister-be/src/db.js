require('dotenv').config()

const { MONGOOSE_DEBUG, MONGODB_URI, MONGODB_TESTS_URI, NODE_ENV } = process.env
const mongoose = require('mongoose')
const Promise = require('bluebird')

mongoose.Promise = Promise

if (MONGOOSE_DEBUG === 'true' && NODE_ENV !== 'test') mongoose.set('debug', true)
const uri = NODE_ENV === 'test'
  ? MONGODB_TESTS_URI
  : MONGODB_URI

module.exports = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
