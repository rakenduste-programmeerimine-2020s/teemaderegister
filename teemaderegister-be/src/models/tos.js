const mongoose = require('mongoose')

const termsOfServiceSchema = new mongoose.Schema(
  {
    content: String
  },
  { timestamps: true }
)

const termsOfService = mongoose.model('TermsOfService', termsOfServiceSchema)

module.exports = termsOfService
