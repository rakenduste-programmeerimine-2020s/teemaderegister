const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: { type: String, required: true, index: true },
    expires: {
      type: Date,
      expires: 60 // 60 seconds after expires
    }
  },
  { timestamps: true }
)

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token
