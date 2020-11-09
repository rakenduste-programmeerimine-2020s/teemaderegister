const bodyParser = require('body-parser')
const express = require('express')
const expressValidator = require('express-validator')
const log = require('./utils/logger')
const { jwtCheck } = require('./utils/jwt')
const helmet = require('helmet')
const { NotAuthorizedError } = require('./utils/errors')

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

const app = express()

app.use(helmet())
app.use(expressValidator())
if (isProduction || isDevelopment) app.use(log.middleWare())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes & 404
const notFound = (req, res) => res.status(404).send('Not Found')
const errorHandler = (err, req, res, next) => {
  if (!(err instanceof NotAuthorizedError)) log.debug(err)

  return res.status(err.status || 500).json({
    message: isProduction ? 'Server error' : err.message,
    errors: err.errors || undefined,
    stack: isProduction ? undefined : err.stack
  })
}

app.use('/api', jwtCheck, require('./routes'), notFound, errorHandler)

module.exports = app
