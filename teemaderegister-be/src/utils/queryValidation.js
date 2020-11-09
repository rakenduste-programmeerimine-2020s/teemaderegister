const { ObjectId } = require('mongoose').Types
const { subKeys, orderTypes, columnKeys } = require('./../constants/query')
const { topicTypes } = require('./../constants/types')
const { Error } = require('./../utils/errors')

const DEFAULT_COLUMN_KEY_TOPICS = 'title'
const DEFAULT_COLUMN_KEY_SUPERVISORS = 'supervisor'
const DEFAULT_ORDER = 'ascend'
const DEFAULT_PAGE = 1
const DEFAULT_SUB = 'all' // for querybuilder

const isValidMongoObjectId = objectId => !!ObjectId.isValid(objectId)
const isValidQueryValue = (allowedKeys, givenKey) =>
  givenKey && !!allowedKeys.includes(givenKey)
const checkForValidTopicTypes = (allowedTypes, givenTypes) =>
  givenTypes && givenTypes.filter(
    type => allowedTypes.includes(type)
  ).length

exports.validateGetTopicsQuery = query => {
  let {
    columnKey,
    curriculumId,
    order,
    page,
    sub,
    supervisorId,
    tab,
    types
  } = query

  if (curriculumId && !isValidMongoObjectId(curriculumId)) {
    throw new Error('Curriculum was not found')
  }

  if (supervisorId && !isValidMongoObjectId(supervisorId)) {
    throw new Error('Supervisor was not found')
  }

  tab = 'topics' // overwrite just in case

  columnKey = isValidQueryValue(columnKeys[tab], columnKey)
    ? columnKey
    : DEFAULT_COLUMN_KEY_TOPICS

  sub = isValidQueryValue(subKeys[tab], sub) ? sub : DEFAULT_SUB

  order = isValidQueryValue(orderTypes, order) ? order : DEFAULT_ORDER

  types = checkForValidTopicTypes(topicTypes, types)
    ? types
    : undefined

  page = page || DEFAULT_PAGE

  const validatedQuery = {
    ...query,
    columnKey,
    curriculumId,
    order,
    page,
    sub,
    supervisorId,
    tab,
    types
  }
  return validatedQuery
}

exports.validateGetSupervisorsQuery = query => {
  let {
    curriculumId,
    columnKey,
    order,
    page,
    tab,
    sub
  } = query

  if (curriculumId && !isValidMongoObjectId(curriculumId)) {
    throw new Error('Supervisor was not found')
  }

  tab = 'supervisors' // overwrite just in case

  columnKey = isValidQueryValue(columnKeys[tab], columnKey)
    ? columnKey
    : DEFAULT_COLUMN_KEY_SUPERVISORS

  order = isValidQueryValue(orderTypes, order) ? order : DEFAULT_ORDER

  sub = isValidQueryValue(subKeys[tab], sub) ? sub : DEFAULT_SUB

  page = page || DEFAULT_PAGE

  const validatedQuery = {
    ...query,
    curriculumId,
    columnKey,
    order,
    page,
    sub,
    tab
  }
  return validatedQuery
}
