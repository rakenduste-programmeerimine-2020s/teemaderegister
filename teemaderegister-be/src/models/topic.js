const mongoose = require('mongoose')
const { topicTypes } = require('./../constants/types')

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleEng: { type: String, required: true },
    slug: { type: String, required: true }, // created from title

    description: { type: String },

    supervisors: [
      {
        type: {
          type: String,
          enum: ['Main', 'Co'],
          required: true
        },
        supervisor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        }
      }
    ],

    curriculums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curriculum',
        required: true
      }
    ],

    types: [
      {
        type: String,
        enum: topicTypes,
        required: true
      }
    ],

    author: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phone: { type: String }
    },

    specialConditions: { type: String },

    file: { type: String },
    attachments: [{ type: String }],

    accepted: { type: Date },
    registered: { type: Date },
    defended: { type: Date },
    archived: { type: Date },

    starred: { type: Boolean }
  },
  {
    timestamps: true
  }
)

// Indexes and unique fields
topicSchema.index({ slug: 1 }, { unique: true })

const Topic = mongoose.model('Topic', topicSchema)

module.exports = Topic
