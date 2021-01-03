const mongoose = require('mongoose')

const termsOfServiceSchema = new mongoose.Schema(
  {
    content: String
  },
  { timestamps: true }
)

const TermsOfService = mongoose.model('TermsOfService', termsOfServiceSchema)

module.exports = TermsOfService
