const { body, validationResult, check } = require('express-validator/check')
const { curriculumTypes } = require('../constants/types')
const ObjectId = require('mongoose').Types.ObjectId
const path = require('path')
const { UnprocessableEntityError } = require('./errors')
const roles = require('../constants/roles')

const errorCheck = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg
    return next(new UnprocessableEntityError(message))
  }
  next()
}

const passwordMinLength = 8
const curriculumNamesMinLength = 3

module.exports.localLogin = [
  body('email')
    .isEmail().withMessage('Email is not valid')
    .trim().normalizeEmail({ remove_dots: false }),
  body('password')
    .isLength({ min: passwordMinLength })
    .withMessage(`Password must be at least ${passwordMinLength} characters long`),
  errorCheck
]

module.exports.localSignup = [
  body('firstName')
    .exists().withMessage('FirstName is required')
    .trim()
    .isLength({ min: 1 }).withMessage('FirstName is required'),
  body('lastName')
    .exists().withMessage('LastName is required')
    .trim()
    .isLength({ min: 1 }).withMessage('LastName is required'),
  body('email')
    .isEmail().withMessage('Email is not valid')
    .trim().normalizeEmail({ remove_dots: false }),
  body('password')
    .isLength({ min: passwordMinLength }).withMessage(
      `Password must be at least ${passwordMinLength} characters long`
    ),
  body('roles').custom(userRoles => {
    const rolesArray = Object.values(roles)
    const inAllowedRoles = userRoles.every(role => {
      return rolesArray.includes(role)
    })
    if (!inAllowedRoles) throw new Error('User role(s) not valid')

    return true
  }),
  errorCheck
]

module.exports.passwordResetEmail = [
  body('email')
    .isEmail().withMessage('Email is not valid')
    .trim().normalizeEmail({ remove_dots: false }),
  errorCheck
]

module.exports.passwordResetMatch = [
  body('password')
    .isLength({ min: passwordMinLength })
    .withMessage(`Password must be at least ${passwordMinLength} characters long`),
  check('password-confirm', 'Passwords does not match. Please make sure that given passwords match.')
    .exists()
    .custom((value, { req }) => value === req.body.password),
  errorCheck
]

module.exports.userAccountUpdate = [
  body('email')
    .isEmail().withMessage('Email is not valid')
    .trim().normalizeEmail({ remove_dots: false }),
  body('firstName')
    .exists().withMessage('FirstName is required')
    .trim()
    .isLength({ min: 1 }).withMessage('FirstName is required'),
  body('lastName').exists().withMessage('LastName is required')
    .trim()
    .isLength({ min: 1 }).withMessage('LastName is required'),
  errorCheck
]

module.exports.userPasswordUpdate = [
  check('currentPassword').exists().withMessage('CurrentPassword is required'),
  body('newPassword')
    .isLength({ min: passwordMinLength })
    .withMessage(`Passwords must be at least ${passwordMinLength} characters longs`),
  check('newPassword', 'New password must be different from the current one')
    .exists()
    .custom((value, { req }) => value !== req.body.currentPassword),
  check('confirmPassword', 'New passwords must match')
    .exists()
    .custom((value, { req }) => value === req.body.newPassword),
  errorCheck
]

module.exports.addCurriculumValidation = [
  body('type')
    .custom((value) => curriculumTypes.includes(value))
    .withMessage('Curriculum type is not valid'),
  body('faculty')
    .exists().withMessage('Faculty is required')
    .trim()
    .isLength({ min: 1 }).withMessage('Faculty is required'),
  body('abbreviation')
    .exists().withMessage('Abbreviation is required')
    .trim()
    .isLength({ min: 1 }).withMessage('Abbreviation is required'),
  body('representative')
    .custom((value) => ObjectId.isValid(value))
    .withMessage('Representative is not valid'),
  body(['names.et', 'names.en'])
    .trim()
    .isLength({min: curriculumNamesMinLength})
    .withMessage(`Name must be at least ${curriculumNamesMinLength} characters long`),
  errorCheck
]

module.exports.profilePictureUpload = (req, file, next) => {
  const fileTypes = new RegExp('jpeg|jpg|png')
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = fileTypes.test(file.mimetype)

  if (!mimetype || !extname) return next(new Error('Unsupported file type'))

  return next(null, true)
}
