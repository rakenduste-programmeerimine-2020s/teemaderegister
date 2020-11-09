const mongoose = require('mongoose')
const { curriculumTypes } = require('./../constants/types')

const curriculumSchema = new mongoose.Schema(
  {
    names: {
      et: { type: String, required: true },
      en: { type: String, required: true }
    },
    slugs: {
      et: { type: String, required: true },
      en: { type: String, required: true }
    },
    abbreviation: { type: String, required: true, unique: true },
    faculty: { type: String, required: true },
    languages: [
      {
        type: String,
        enum: ['ET', 'EN'],
        required: true
      }
    ],
    representative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: curriculumTypes,
      required: true
    },
    closed: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
)

// Indexes and unique fields
curriculumSchema.index({
  'slugs.et': 1,
  'slugs.en': 1
}, {
  unique: true
})

const Curriculum = mongoose.model('Curriculum', curriculumSchema)

module.exports = Curriculum
