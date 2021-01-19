const SubclassError = require('subclass-error')

exports.Error = SubclassError('Error', { status: 400, message: 'Bad request' })
exports.InsertToken = SubclassError('Error', {status: 401, message: 'Please insert token'})

exports.NotAuthorizedError = SubclassError('NotAuthorizedError', { status: 401, message: 'Unauthorized' })
exports.ForbiddenError = SubclassError('ForbiddenError', { status: 403 })
exports.NotFoundError = SubclassError('NotFoundError', { status: 404 })
exports.UnprocessableEntityError = SubclassError('UnprocessableEntityError', { status: 422 })
exports.ServerError = SubclassError('ServerError', { status: 500, message: 'Server error' })
